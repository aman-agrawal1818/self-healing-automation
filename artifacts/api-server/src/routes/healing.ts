import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateHealingWorkflowBody,
  CreateHealingWorkflowResponse,
  DecideHealingIncidentBody,
  DecideHealingIncidentParams,
  DecideHealingIncidentResponse,
  DeleteHealingWorkflowParams,
  DiagnoseHealingIncidentBody,
  DiagnoseHealingIncidentParams,
  DiagnoseHealingIncidentResponse,
  GetHealingIncidentParams,
  GetHealingIncidentResponse,
  GetHealingOverviewResponse,
  ListHealingIncidentsResponse,
  ListHealingWorkflowsResponse,
  RunHealingWorkflowBody,
  RunHealingWorkflowParams,
  RunHealingWorkflowResponse,
  UpdateHealingWorkflowBody,
  UpdateHealingWorkflowParams,
  UpdateHealingWorkflowResponse,
} from "@workspace/api-zod";
import {
  db,
  healingIncidentsTable,
  healingRunsTable,
  healingWorkflowsTable,
} from "@workspace/db";

const router: IRouter = Router();
let seedTask: Promise<void> | undefined;

const sampleWorkflows = [
  {
    name: "Shopify order sync",
    integration: "Shopify → NetSuite",
    description: "Sync paid orders into the finance system.",
    failureMode: "schema_mismatch" as const,
    approvalRequired: true,
  },
  {
    name: "Invoice approval queue",
    integration: "Stripe → Slack",
    description: "Route invoices to the right finance approver.",
    failureMode: "rate_limit" as const,
    approvalRequired: true,
  },
  {
    name: "Warehouse nightly ingest",
    integration: "S3 → Snowflake",
    description: "Validate and load the nightly operations export.",
    failureMode: "healthy" as const,
    approvalRequired: false,
  },
  {
    name: "CRM contact enrichment",
    integration: "HubSpot → Clearbit",
    description: "Enrich new contacts before assigning ownership.",
    failureMode: "invalid_payload" as const,
    approvalRequired: false,
  },
];

async function ensureSeeded(): Promise<void> {
  if (!seedTask) {
    seedTask = (async () => {
      const existing = await db.select({ id: healingWorkflowsTable.id }).from(healingWorkflowsTable).limit(1);
      if (existing.length > 0) return;

      const workflows = await db.insert(healingWorkflowsTable).values(sampleWorkflows).returning();
      const now = new Date();
      const earlier = new Date(now.getTime() - 19 * 60_000);
      const activeIncident = await db.insert(healingIncidentsTable).values({
        workflowId: workflows[0]!.id,
        workflowName: workflows[0]!.name,
        severity: "high",
        status: "detected",
        category: "Schema mismatch",
        summary: "Order payload no longer matches the destination schema.",
        logExcerpt: 'ValidationError: "customer_id" expected string, received null. Path: order.customer_id',
        createdAt: earlier,
        updatedAt: earlier,
      }).returning();
      const resolvedIncident = await db.insert(healingIncidentsTable).values({
        workflowId: workflows[1]!.id,
        workflowName: workflows[1]!.name,
        severity: "medium",
        status: "resolved",
        category: "Rate limit",
        summary: "The billing provider throttled an invoice handoff.",
        rootCause: "The provider returned HTTP 429 because the workflow sent a burst of requests above its current quota.",
        recommendation: "Respect Retry-After and retry with capped exponential backoff.",
        patch: "Added an idempotent retry adapter with capped exponential backoff.",
        confidence: 0.96,
        logExcerpt: "HTTP 429 Too Many Requests. Retry-After: 2. Request was safe to retry.",
        retryCount: 1,
        createdAt: new Date(now.getTime() - 87 * 60_000),
        updatedAt: new Date(now.getTime() - 84 * 60_000),
      }).returning();

      await db.insert(healingRunsTable).values([
        {
          workflowId: workflows[0]!.id,
          workflowName: workflows[0]!.name,
          status: "failed",
          failureMode: "schema_mismatch",
          incidentId: activeIncident[0]!.id,
          durationMs: 1240,
          message: "Run stopped at destination validation.",
          createdAt: earlier,
        },
        {
          workflowId: workflows[1]!.id,
          workflowName: workflows[1]!.name,
          status: "failed",
          failureMode: "rate_limit",
          incidentId: resolvedIncident[0]!.id,
          durationMs: 881,
          message: "Provider throttled the request.",
          createdAt: new Date(now.getTime() - 87 * 60_000),
        },
        {
          workflowId: workflows[1]!.id,
          workflowName: workflows[1]!.name,
          status: "recovered",
          failureMode: "healthy",
          incidentId: resolvedIncident[0]!.id,
          durationMs: 532,
          message: "Retry succeeded after the recovery adapter was applied.",
          createdAt: new Date(now.getTime() - 84 * 60_000),
        },
        {
          workflowId: workflows[2]!.id,
          workflowName: workflows[2]!.name,
          status: "succeeded",
          failureMode: "healthy",
          incidentId: null,
          durationMs: 1842,
          message: "All output rows passed validation.",
          createdAt: new Date(now.getTime() - 5 * 60_000),
        },
      ]);
    })().catch((error: unknown) => {
      seedTask = undefined;
      throw error;
    });
  }
  await seedTask;
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function categoryFor(mode: string): string {
  switch (mode) {
    case "schema_mismatch": return "Schema mismatch";
    case "rate_limit": return "Rate limit";
    case "timeout": return "Timeout";
    case "invalid_payload": return "Invalid payload";
    default: return "Unexpected outcome";
  }
}

function failureLog(mode: string): string {
  switch (mode) {
    case "schema_mismatch":
      return 'ValidationError: "customer_id" expected string, received null. Path: order.customer_id';
    case "rate_limit":
      return "HTTP 429 Too Many Requests. Provider quota exceeded; retry after 2 seconds.";
    case "timeout":
      return "ETIMEDOUT: webhook receiver did not respond within 30 seconds.";
    case "invalid_payload":
      return 'PayloadError: unexpected field "customer" and missing required field "email".';
    default:
      return "Unexpected workflow result: downstream output did not match the expected contract.";
  }
}

function diagnose(mode: string, log: string): {
  rootCause: string;
  recommendation: string;
  patch: string;
  confidence: number;
} {
  switch (mode) {
    case "schema_mismatch":
      return {
        rootCause: "The source payload changed shape: customer_id is null or absent, while the destination still requires a string.",
        recommendation: "Normalize customer identifiers from the nested customer object, coerce valid IDs to strings, and quarantine records with no usable identifier.",
        patch: "Add a schema adapter: customer_id = String(customer.id ?? customer_id); reject and quarantine the record if both values are missing.",
        confidence: 0.94,
      };
    case "rate_limit":
      return {
        rootCause: "The provider returned HTTP 429 after a request burst exceeded its current rate limit.",
        recommendation: "Honor Retry-After and retry with capped exponential backoff and an idempotency key.",
        patch: "Wrap the provider call in an idempotent retry adapter with capped exponential backoff and Retry-After support.",
        confidence: 0.97,
      };
    case "timeout":
      return {
        rootCause: "The downstream receiver did not respond before the 30-second execution deadline.",
        recommendation: "Retry only the idempotent delivery step, with a bounded backoff and a dead-letter path after the retry limit.",
        patch: "Add a bounded, idempotent retry policy; preserve the event key and send exhausted attempts to the dead-letter queue.",
        confidence: 0.91,
      };
    case "invalid_payload":
      return {
        rootCause: "The incoming payload uses a different field shape and omits a required email field.",
        recommendation: "Map the nested contact object to the expected contract and stop records that still lack an email.",
        patch: "Map email = contact.email ?? email; remove unknown fields; quarantine the payload if email remains empty.",
        confidence: 0.93,
      };
    default:
      return {
        rootCause: `The execution log indicates an unexpected result that does not match a known failure signature: ${log.slice(0, 120)}`,
        recommendation: "Review the captured execution context, then retry only after confirming the downstream action is safe to repeat.",
        patch: "No automatic code change proposed. Add a guard around the unexpected result and require operator review.",
        confidence: 0.62,
      };
  }
}

async function getWorkflow(workflowId: string) {
  const [workflow] = await db.select().from(healingWorkflowsTable).where(eq(healingWorkflowsTable.id, workflowId)).limit(1);
  return workflow;
}

async function shapeWorkflow(workflow: NonNullable<Awaited<ReturnType<typeof getWorkflow>>>) {
  const runs = await db
    .select()
    .from(healingRunsTable)
    .where(eq(healingRunsTable.workflowId, workflow.id))
    .orderBy(desc(healingRunsTable.createdAt));
  const todaysRuns = runs.filter((run) => run.createdAt >= startOfToday());
  const successful = runs.filter((run) => run.status === "succeeded" || run.status === "recovered").length;
  return {
    ...workflow,
    runsToday: todaysRuns.length,
    recoveryRate: runs.length === 0 ? 100 : Math.round((successful / runs.length) * 1000) / 10,
    lastRunAt: runs[0]?.createdAt ?? null,
  };
}

async function shapeIncident(incident: typeof healingIncidentsTable.$inferSelect) {
  return GetHealingIncidentResponse.parse(incident);
}

async function recoverIncident(incidentId: string, incident: typeof healingIncidentsTable.$inferSelect, retryCount: number) {
  const [run] = await db.insert(healingRunsTable).values({
    workflowId: incident.workflowId,
    workflowName: incident.workflowName,
    status: "recovered",
    failureMode: "healthy",
    incidentId,
    durationMs: 460 + Math.floor(Math.random() * 420),
    message: "Retry succeeded. Output passed downstream validation.",
  }).returning();
  const [updated] = await db.update(healingIncidentsTable).set({
    status: "resolved",
    retryCount,
    updatedAt: run!.createdAt,
  }).where(eq(healingIncidentsTable.id, incidentId)).returning();
  return updated!;
}

router.get("/healing/overview", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const [workflows, incidents, runs] = await Promise.all([
    db.select().from(healingWorkflowsTable),
    db.select().from(healingIncidentsTable).orderBy(desc(healingIncidentsTable.updatedAt)),
    db.select().from(healingRunsTable).orderBy(desc(healingRunsTable.createdAt)),
  ]);
  const today = startOfToday();
  const todaysRuns = runs.filter((run) => run.createdAt >= today);
  const successfulRuns = todaysRuns.filter((run) => run.status === "succeeded" || run.status === "recovered").length;
  const recoveryDurations = runs.filter((run) => run.status === "recovered").map((run) => run.durationMs / 1000);
  const openIncidents = incidents.filter((incident) => incident.status !== "resolved");
  const recentActivity = [
    ...incidents.map((incident) => ({
      id: `incident-${incident.id}`,
      title: incident.status === "resolved" ? "Incident recovered" : "Workflow issue detected",
      detail: `${incident.workflowName} · ${incident.category}`,
      kind: incident.status === "resolved" ? "recovery" as const : "incident" as const,
      createdAt: incident.updatedAt,
    })),
    ...runs.map((run) => ({
      id: `run-${run.id}`,
      title: run.status === "failed" ? "Execution failed" : run.status === "recovered" ? "Retry verified" : "Execution completed",
      detail: `${run.workflowName} · ${run.message}`,
      kind: run.status === "recovered" ? "recovery" as const : "run" as const,
      createdAt: run.createdAt,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8);

  res.json(GetHealingOverviewResponse.parse({
    activeWorkflows: workflows.filter((workflow) => workflow.status === "active").length,
    openIncidents: openIncidents.length,
    runsToday: todaysRuns.length,
    recoveredToday: todaysRuns.filter((run) => run.status === "recovered").length,
    successRate: todaysRuns.length === 0 ? 100 : Math.round((successfulRuns / todaysRuns.length) * 1000) / 10,
    meanRecoverySeconds: recoveryDurations.length === 0
      ? 0
      : Math.round((recoveryDurations.reduce((sum, value) => sum + value, 0) / recoveryDurations.length) * 10) / 10,
    incidentsByStatus: {
      detected: incidents.filter((incident) => incident.status === "detected" || incident.status === "diagnosing").length,
      awaitingApproval: incidents.filter((incident) => incident.status === "awaiting_approval").length,
      resolved: incidents.filter((incident) => incident.status === "resolved").length,
      escalated: incidents.filter((incident) => incident.status === "escalated").length,
    },
    recentActivity,
  }));
});

router.get("/healing/workflows", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const workflows = await db.select().from(healingWorkflowsTable).orderBy(desc(healingWorkflowsTable.createdAt));
  const shaped = await Promise.all(workflows.map(shapeWorkflow));
  res.json(ListHealingWorkflowsResponse.parse(shaped));
});

router.post("/healing/workflows", async (req, res): Promise<void> => {
  await ensureSeeded();
  const parsed = CreateHealingWorkflowBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid workflow input");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [workflow] = await db.insert(healingWorkflowsTable).values(parsed.data).returning();
  res.status(201).json(CreateHealingWorkflowResponse.parse(await shapeWorkflow(workflow!)));
});

router.patch("/healing/workflows/:workflowId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = UpdateHealingWorkflowParams.safeParse(req.params);
  const body = UpdateHealingWorkflowBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.error?.message ?? "Invalid request body";
    res.status(400).json({ error });
    return;
  }
  const [workflow] = await db.update(healingWorkflowsTable)
    .set(body.data)
    .where(eq(healingWorkflowsTable.id, params.data.workflowId))
    .returning();
  if (!workflow) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }
  res.json(UpdateHealingWorkflowResponse.parse(await shapeWorkflow(workflow)));
});

router.delete("/healing/workflows/:workflowId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = DeleteHealingWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workflow] = await db.delete(healingWorkflowsTable)
    .where(eq(healingWorkflowsTable.id, params.data.workflowId))
    .returning();
  if (!workflow) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }
  res.sendStatus(204);
});

router.post("/healing/workflows/:workflowId/run", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = RunHealingWorkflowParams.safeParse(req.params);
  const body = RunHealingWorkflowBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.error?.message ?? "Invalid request body";
    res.status(400).json({ error });
    return;
  }
  const workflow = await getWorkflow(params.data.workflowId);
  if (!workflow) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }
  if (workflow.status === "paused") {
    res.status(409).json({ error: "Resume this workflow before running it." });
    return;
  }

  const mode = body.data.failureMode;
  const createdAt = new Date();
  if (mode === "healthy") {
    const [run] = await db.insert(healingRunsTable).values({
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: "succeeded",
      failureMode: mode,
      incidentId: null,
      durationMs: 740 + Math.floor(Math.random() * 900),
      message: "All output passed the expected contract.",
      createdAt,
    }).returning();
    res.status(201).json(RunHealingWorkflowResponse.parse({
      ...run,
      incidentId: null,
    }));
    return;
  }

  const logExcerpt = failureLog(mode);
  const [incident] = await db.insert(healingIncidentsTable).values({
    workflowId: workflow.id,
    workflowName: workflow.name,
    severity: mode === "schema_mismatch" || mode === "invalid_payload" ? "high" : "medium",
    status: "detected",
    category: categoryFor(mode),
    summary: `${categoryFor(mode)} stopped this workflow before its output was committed.`,
    logExcerpt,
    createdAt,
    updatedAt: createdAt,
  }).returning();
  const [run] = await db.insert(healingRunsTable).values({
    workflowId: workflow.id,
    workflowName: workflow.name,
    status: "failed",
    failureMode: mode,
    incidentId: incident!.id,
    durationMs: 900 + Math.floor(Math.random() * 1100),
    message: `${categoryFor(mode)} detected; execution safely stopped.`,
    createdAt,
  }).returning();
  res.status(201).json(RunHealingWorkflowResponse.parse({
    ...run,
    incidentId: incident!.id,
  }));
});

router.get("/healing/incidents", async (_req, res): Promise<void> => {
  await ensureSeeded();
  const incidents = await db.select().from(healingIncidentsTable).orderBy(desc(healingIncidentsTable.updatedAt));
  res.json(ListHealingIncidentsResponse.parse(incidents));
});

router.get("/healing/incidents/:incidentId", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = GetHealingIncidentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [incident] = await db.select().from(healingIncidentsTable)
    .where(eq(healingIncidentsTable.id, params.data.incidentId))
    .limit(1);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  res.json(await shapeIncident(incident));
});

router.post("/healing/incidents/:incidentId/diagnose", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = DiagnoseHealingIncidentParams.safeParse(req.params);
  const body = DiagnoseHealingIncidentBody.safeParse(req.body ?? {});
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.error?.message ?? "Invalid request body";
    res.status(400).json({ error });
    return;
  }
  const [incident] = await db.select().from(healingIncidentsTable)
    .where(eq(healingIncidentsTable.id, params.data.incidentId))
    .limit(1);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  if (incident.status === "resolved") {
    res.status(409).json({ error: "This incident has already been recovered." });
    return;
  }

  const analysis = diagnose(incident.category === "Schema mismatch" ? "schema_mismatch"
    : incident.category === "Rate limit" ? "rate_limit"
      : incident.category === "Timeout" ? "timeout"
        : incident.category === "Invalid payload" ? "invalid_payload" : "unknown", incident.logExcerpt);
  const [workflow] = await db.select().from(healingWorkflowsTable)
    .where(eq(healingWorkflowsTable.id, incident.workflowId))
    .limit(1);
  const details = body.data.operatorNotes?.trim()
    ? ` Operator context: ${body.data.operatorNotes.trim()}`
    : "";
  const updatedAt = new Date();
  const [updated] = await db.update(healingIncidentsTable).set({
    ...analysis,
    rootCause: `${analysis.rootCause}${details}`,
    status: workflow?.approvalRequired ? "awaiting_approval" : "healing",
    updatedAt,
  }).where(eq(healingIncidentsTable.id, incident.id)).returning();

  const result = workflow?.approvalRequired
    ? updated!
    : await recoverIncident(incident.id, updated!, incident.retryCount + 1);
  req.log.info({ incidentId: incident.id, approvalRequired: !!workflow?.approvalRequired }, "Incident diagnosis completed");
  res.json(DiagnoseHealingIncidentResponse.parse(result));
});

router.post("/healing/incidents/:incidentId/decision", async (req, res): Promise<void> => {
  await ensureSeeded();
  const params = DecideHealingIncidentParams.safeParse(req.params);
  const body = DecideHealingIncidentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success ? params.error.message : body.error?.message ?? "Invalid request body";
    res.status(400).json({ error });
    return;
  }
  const [incident] = await db.select().from(healingIncidentsTable)
    .where(eq(healingIncidentsTable.id, params.data.incidentId))
    .limit(1);
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }
  if (incident.status !== "awaiting_approval") {
    res.status(409).json({ error: "This incident is not awaiting an approval decision." });
    return;
  }

  let updated: typeof healingIncidentsTable.$inferSelect;
  if (body.data.decision === "approve") {
    const healing = await db.update(healingIncidentsTable).set({
      status: "healing",
      updatedAt: new Date(),
    }).where(eq(healingIncidentsTable.id, incident.id)).returning();
    updated = await recoverIncident(incident.id, healing[0]!, incident.retryCount + 1);
  } else {
    const [rejected] = await db.update(healingIncidentsTable).set({
      status: "escalated",
      updatedAt: new Date(),
    }).where(eq(healingIncidentsTable.id, incident.id)).returning();
    updated = rejected!;
  }
  res.json(DecideHealingIncidentResponse.parse(updated));
});

export default router;
