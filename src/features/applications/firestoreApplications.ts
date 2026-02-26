export type {
  ApplicationDoc,
  HistoryEventDoc,
  ProcessStage,
  ProcessStatus,
} from "./firestore/types";

export {
  // CRUD + history
  createApplication,
  getApplication,
  getApplicationHistory,
  updateApplicationWithHistory,
  changeStatus,

  addComment,

  // system/maintenance helpers
  ensureUserDoc,
  autoMarkGhosting,

  // queries used by dashboards/lists
  queryAllActiveApplications,
  queryFollowUpsDue,
  queryPipelineByStatus,
  queryTodayTopPriority,
} from "./firestore/api";
