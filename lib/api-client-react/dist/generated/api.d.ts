import type { DataTag, DefinedInitialDataOptions, DefinedUseQueryResult, QueryClient, QueryKey, UndefinedInitialDataOptions, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { HealingDecisionInput, HealingDiagnosisInput, HealingIncident, HealingOverview, HealingRun, HealingRunInput, HealingWorkflow, HealingWorkflowInput, HealingWorkflowUpdate, HealthStatus } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof healthCheck>>, TError, Awaited<ReturnType<typeof healthCheck>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getGetHealingOverviewUrl: () => string;
/**
 * @summary Get dashboard metrics and recent activity
 */
export declare const getHealingOverview: (options?: Parameters<typeof customFetch>[1]) => Promise<HealingOverview>;
export declare const getGetHealingOverviewQueryKey: () => readonly ["/api/healing/overview"];
export declare const getGetHealingOverviewQueryOptions: <TData = Awaited<ReturnType<typeof getHealingOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetHealingOverviewQueryResult = NonNullable<Awaited<ReturnType<typeof getHealingOverview>>>;
export type GetHealingOverviewQueryError = ErrorType<unknown>;
export declare function useGetHealingOverview<TData = Awaited<ReturnType<typeof getHealingOverview>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, Awaited<ReturnType<typeof getHealingOverview>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetHealingOverview<TData = Awaited<ReturnType<typeof getHealingOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, Awaited<ReturnType<typeof getHealingOverview>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetHealingOverview<TData = Awaited<ReturnType<typeof getHealingOverview>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingOverview>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getListHealingWorkflowsUrl: () => string;
/**
 * @summary List monitored workflows
 */
export declare const listHealingWorkflows: (options?: Parameters<typeof customFetch>[1]) => Promise<HealingWorkflow[]>;
export declare const getListHealingWorkflowsQueryKey: () => readonly ["/api/healing/workflows"];
export declare const getListHealingWorkflowsQueryOptions: <TData = Awaited<ReturnType<typeof listHealingWorkflows>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListHealingWorkflowsQueryResult = NonNullable<Awaited<ReturnType<typeof listHealingWorkflows>>>;
export type ListHealingWorkflowsQueryError = ErrorType<unknown>;
export declare function useListHealingWorkflows<TData = Awaited<ReturnType<typeof listHealingWorkflows>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, Awaited<ReturnType<typeof listHealingWorkflows>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListHealingWorkflows<TData = Awaited<ReturnType<typeof listHealingWorkflows>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, Awaited<ReturnType<typeof listHealingWorkflows>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListHealingWorkflows<TData = Awaited<ReturnType<typeof listHealingWorkflows>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingWorkflows>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getCreateHealingWorkflowUrl: () => string;
/**
 * @summary Create a monitored workflow
 */
export declare const createHealingWorkflow: (healingWorkflowInput: HealingWorkflowInput, options?: Parameters<typeof customFetch>[1]) => Promise<HealingWorkflow>;
export declare const getCreateHealingWorkflowMutationKey: () => readonly ["createHealingWorkflow"];
export declare const getCreateHealingWorkflowMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createHealingWorkflow>>, TError, CreateHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createHealingWorkflow>>, TError, CreateHealingWorkflowMutationVariables, TContext>;
export type CreateHealingWorkflowMutationResult = NonNullable<Awaited<ReturnType<typeof createHealingWorkflow>>>;
export type CreateHealingWorkflowMutationBody = BodyType<HealingWorkflowInput>;
export type CreateHealingWorkflowMutationError = ErrorType<unknown>;
export type CreateHealingWorkflowMutationVariables = {
    data: BodyType<HealingWorkflowInput>;
};
/**
* @summary Create a monitored workflow
*/
export declare const useCreateHealingWorkflow: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createHealingWorkflow>>, TError, CreateHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createHealingWorkflow>>, TError, CreateHealingWorkflowMutationVariables, TContext>;
export declare const getUpdateHealingWorkflowUrl: (workflowId: string) => string;
/**
 * @summary Update a workflow's monitoring settings
 */
export declare const updateHealingWorkflow: (workflowId: string, healingWorkflowUpdate: HealingWorkflowUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<HealingWorkflow>;
export declare const getUpdateHealingWorkflowMutationKey: () => readonly ["updateHealingWorkflow"];
export declare const getUpdateHealingWorkflowMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateHealingWorkflow>>, TError, UpdateHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateHealingWorkflow>>, TError, UpdateHealingWorkflowMutationVariables, TContext>;
export type UpdateHealingWorkflowMutationResult = NonNullable<Awaited<ReturnType<typeof updateHealingWorkflow>>>;
export type UpdateHealingWorkflowMutationBody = BodyType<HealingWorkflowUpdate>;
export type UpdateHealingWorkflowMutationError = ErrorType<void>;
export type UpdateHealingWorkflowMutationVariables = {
    workflowId: string;
    data: BodyType<HealingWorkflowUpdate>;
};
/**
* @summary Update a workflow's monitoring settings
*/
export declare const useUpdateHealingWorkflow: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateHealingWorkflow>>, TError, UpdateHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateHealingWorkflow>>, TError, UpdateHealingWorkflowMutationVariables, TContext>;
export declare const getDeleteHealingWorkflowUrl: (workflowId: string) => string;
/**
 * @summary Delete a workflow
 */
export declare const deleteHealingWorkflow: (workflowId: string, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteHealingWorkflowMutationKey: () => readonly ["deleteHealingWorkflow"];
export declare const getDeleteHealingWorkflowMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteHealingWorkflow>>, TError, DeleteHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteHealingWorkflow>>, TError, DeleteHealingWorkflowMutationVariables, TContext>;
export type DeleteHealingWorkflowMutationResult = NonNullable<Awaited<ReturnType<typeof deleteHealingWorkflow>>>;
export type DeleteHealingWorkflowMutationError = ErrorType<void>;
export type DeleteHealingWorkflowMutationVariables = {
    workflowId: string;
};
/**
* @summary Delete a workflow
*/
export declare const useDeleteHealingWorkflow: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteHealingWorkflow>>, TError, DeleteHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteHealingWorkflow>>, TError, DeleteHealingWorkflowMutationVariables, TContext>;
export declare const getRunHealingWorkflowUrl: (workflowId: string) => string;
/**
 * @summary Run a workflow with an optional simulated failure
 */
export declare const runHealingWorkflow: (workflowId: string, healingRunInput: HealingRunInput, options?: Parameters<typeof customFetch>[1]) => Promise<HealingRun>;
export declare const getRunHealingWorkflowMutationKey: () => readonly ["runHealingWorkflow"];
export declare const getRunHealingWorkflowMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runHealingWorkflow>>, TError, RunHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof runHealingWorkflow>>, TError, RunHealingWorkflowMutationVariables, TContext>;
export type RunHealingWorkflowMutationResult = NonNullable<Awaited<ReturnType<typeof runHealingWorkflow>>>;
export type RunHealingWorkflowMutationBody = BodyType<HealingRunInput>;
export type RunHealingWorkflowMutationError = ErrorType<void>;
export type RunHealingWorkflowMutationVariables = {
    workflowId: string;
    data: BodyType<HealingRunInput>;
};
/**
* @summary Run a workflow with an optional simulated failure
*/
export declare const useRunHealingWorkflow: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runHealingWorkflow>>, TError, RunHealingWorkflowMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof runHealingWorkflow>>, TError, RunHealingWorkflowMutationVariables, TContext>;
export declare const getListHealingIncidentsUrl: () => string;
/**
 * @summary List incidents, newest first
 */
export declare const listHealingIncidents: (options?: Parameters<typeof customFetch>[1]) => Promise<HealingIncident[]>;
export declare const getListHealingIncidentsQueryKey: () => readonly ["/api/healing/incidents"];
export declare const getListHealingIncidentsQueryOptions: <TData = Awaited<ReturnType<typeof listHealingIncidents>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type ListHealingIncidentsQueryResult = NonNullable<Awaited<ReturnType<typeof listHealingIncidents>>>;
export type ListHealingIncidentsQueryError = ErrorType<unknown>;
export declare function useListHealingIncidents<TData = Awaited<ReturnType<typeof listHealingIncidents>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, Awaited<ReturnType<typeof listHealingIncidents>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListHealingIncidents<TData = Awaited<ReturnType<typeof listHealingIncidents>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, Awaited<ReturnType<typeof listHealingIncidents>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useListHealingIncidents<TData = Awaited<ReturnType<typeof listHealingIncidents>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof listHealingIncidents>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getGetHealingIncidentUrl: (incidentId: string) => string;
/**
 * @summary Get an incident and its diagnosis
 */
export declare const getHealingIncident: (incidentId: string, options?: Parameters<typeof customFetch>[1]) => Promise<HealingIncident>;
export declare const getGetHealingIncidentQueryKey: (incidentId: string) => readonly [`/api/healing/incidents/${string}`];
export declare const getGetHealingIncidentQueryOptions: <TData = Awaited<ReturnType<typeof getHealingIncident>>, TError = ErrorType<void>>(incidentId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export type GetHealingIncidentQueryResult = NonNullable<Awaited<ReturnType<typeof getHealingIncident>>>;
export type GetHealingIncidentQueryError = ErrorType<void>;
export declare function useGetHealingIncident<TData = Awaited<ReturnType<typeof getHealingIncident>>, TError = ErrorType<void>>(incidentId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, Awaited<ReturnType<typeof getHealingIncident>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetHealingIncident<TData = Awaited<ReturnType<typeof getHealingIncident>>, TError = ErrorType<void>>(incidentId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, Awaited<ReturnType<typeof getHealingIncident>>>, 'initialData'>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare function useGetHealingIncident<TData = Awaited<ReturnType<typeof getHealingIncident>>, TError = ErrorType<void>>(incidentId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getHealingIncident>>, TError, TData>>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
export declare const getDiagnoseHealingIncidentUrl: (incidentId: string) => string;
/**
 * @summary Analyze incident logs and propose a corrective action
 */
export declare const diagnoseHealingIncident: (incidentId: string, healingDiagnosisInput: HealingDiagnosisInput, options?: Parameters<typeof customFetch>[1]) => Promise<HealingIncident>;
export declare const getDiagnoseHealingIncidentMutationKey: () => readonly ["diagnoseHealingIncident"];
export declare const getDiagnoseHealingIncidentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof diagnoseHealingIncident>>, TError, DiagnoseHealingIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof diagnoseHealingIncident>>, TError, DiagnoseHealingIncidentMutationVariables, TContext>;
export type DiagnoseHealingIncidentMutationResult = NonNullable<Awaited<ReturnType<typeof diagnoseHealingIncident>>>;
export type DiagnoseHealingIncidentMutationBody = BodyType<HealingDiagnosisInput>;
export type DiagnoseHealingIncidentMutationError = ErrorType<void>;
export type DiagnoseHealingIncidentMutationVariables = {
    incidentId: string;
    data: BodyType<HealingDiagnosisInput>;
};
/**
* @summary Analyze incident logs and propose a corrective action
*/
export declare const useDiagnoseHealingIncident: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof diagnoseHealingIncident>>, TError, DiagnoseHealingIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof diagnoseHealingIncident>>, TError, DiagnoseHealingIncidentMutationVariables, TContext>;
export declare const getDecideHealingIncidentUrl: (incidentId: string) => string;
/**
 * @summary Approve or reject the proposed recovery action
 */
export declare const decideHealingIncident: (incidentId: string, healingDecisionInput: HealingDecisionInput, options?: Parameters<typeof customFetch>[1]) => Promise<HealingIncident>;
export declare const getDecideHealingIncidentMutationKey: () => readonly ["decideHealingIncident"];
export declare const getDecideHealingIncidentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof decideHealingIncident>>, TError, DecideHealingIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof decideHealingIncident>>, TError, DecideHealingIncidentMutationVariables, TContext>;
export type DecideHealingIncidentMutationResult = NonNullable<Awaited<ReturnType<typeof decideHealingIncident>>>;
export type DecideHealingIncidentMutationBody = BodyType<HealingDecisionInput>;
export type DecideHealingIncidentMutationError = ErrorType<void>;
export type DecideHealingIncidentMutationVariables = {
    incidentId: string;
    data: BodyType<HealingDecisionInput>;
};
/**
* @summary Approve or reject the proposed recovery action
*/
export declare const useDecideHealingIncident: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof decideHealingIncident>>, TError, DecideHealingIncidentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof decideHealingIncident>>, TError, DecideHealingIncidentMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map