import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const healingFailureModeEnum = pgEnum("healing_failure_mode", [
  "healthy",
  "schema_mismatch",
  "rate_limit",
  "timeout",
  "invalid_payload",
]);

export const healingWorkflowStatusEnum = pgEnum("healing_workflow_status", [
  "active",
  "paused",
]);

export const healingIncidentStatusEnum = pgEnum("healing_incident_status", [
  "detected",
  "diagnosing",
  "awaiting_approval",
  "healing",
  "resolved",
  "escalated",
]);

export const healingRunStatusEnum = pgEnum("healing_run_status", [
  "succeeded",
  "failed",
  "recovered",
]);

export const healingWorkflowsTable = pgTable("healing_workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  integration: text("integration").notNull(),
  description: text("description").notNull().default(""),
  status: healingWorkflowStatusEnum("status").notNull().default("active"),
  approvalRequired: boolean("approval_required").notNull().default(true),
  failureMode: healingFailureModeEnum("failure_mode").notNull().default("healthy"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const healingIncidentsTable = pgTable("healing_incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id").notNull().references(() => healingWorkflowsTable.id, { onDelete: "cascade" }),
  workflowName: text("workflow_name").notNull(),
  severity: text("severity").notNull(),
  status: healingIncidentStatusEnum("status").notNull().default("detected"),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  rootCause: text("root_cause"),
  recommendation: text("recommendation"),
  patch: text("patch"),
  confidence: real("confidence"),
  logExcerpt: text("log_excerpt").notNull(),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const healingRunsTable = pgTable("healing_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id").notNull().references(() => healingWorkflowsTable.id, { onDelete: "cascade" }),
  workflowName: text("workflow_name").notNull(),
  status: healingRunStatusEnum("status").notNull(),
  failureMode: healingFailureModeEnum("failure_mode").notNull(),
  incidentId: uuid("incident_id"),
  durationMs: integer("duration_ms").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHealingWorkflowSchema = createInsertSchema(healingWorkflowsTable).omit({
  id: true,
  createdAt: true,
});

export const insertHealingIncidentSchema = createInsertSchema(healingIncidentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealingRunSchema = createInsertSchema(healingRunsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertHealingWorkflow = z.infer<typeof insertHealingWorkflowSchema>;
export type InsertHealingIncident = z.infer<typeof insertHealingIncidentSchema>;
export type InsertHealingRun = z.infer<typeof insertHealingRunSchema>;
export type HealingWorkflow = typeof healingWorkflowsTable.$inferSelect;
export type HealingIncident = typeof healingIncidentsTable.$inferSelect;
export type HealingRun = typeof healingRunsTable.$inferSelect;
