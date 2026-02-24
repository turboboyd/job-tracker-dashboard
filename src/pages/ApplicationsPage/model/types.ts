import type { ProcessStatus } from "src/features/applications/firestoreApplications";

/**
 * View modes for Applications page
 */
export type ViewMode = "pipeline" | "today" | "followups";

/**
 * Create form state for creating new application
 */
export type CreateFormState = {
  companyName: string;
  roleTitle: string;
  vacancyUrl: string;
  source: string;
  rawDescription: string;
};

export const EMPTY_CREATE_FORM: CreateFormState = {
  companyName: "",
  roleTitle: "",
  vacancyUrl: "",
  source: "",
  rawDescription: "",
};

/**
 * Pipeline statuses order
 * (keep aligned with your domain ProcessStatus union)
 */
export type PipelineStatusTab = { key: string; status: ProcessStatus };

/**
 * Tabs for pipeline view.
 * Keys must match i18n: applicationsPage.pipeline.<key>
 */
export const PIPELINE_STATUSES: PipelineStatusTab[] = [
  { key: "saved", status: "SAVED" },
  { key: "applied", status: "APPLIED" },
  { key: "interview", status: "INTERVIEW_1" },
  { key: "offer", status: "OFFER" },
  { key: "rejected", status: "REJECTED" },
];

/**
 * i18n key builder for process statuses.
 * Use with t(processStatusKey(status))
 */
export function processStatusKey(status: ProcessStatus): string {
  return `applicationsPage.statuses.${status.toLowerCase()}`;
}
