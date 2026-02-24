import type { ProcessStatus } from "src/features/applications/firestoreApplications";

import type { ViewMode } from "../model/types";

import { PipelineStatusTabs } from "./PipelineStatusTabs";
import { ViewMetaBar } from "./ViewMetaBar";

export function ApplicationsToolbar(props: {
  view: ViewMode;
  activeStatus: ProcessStatus;
  onChangeStatus: (s: ProcessStatus) => void;
  isLoading: boolean;
  count: number;
}) {
  const { view, activeStatus, onChangeStatus, isLoading, count } = props;

  if (view === "pipeline") {
    return (
      <PipelineStatusTabs
        activeStatus={activeStatus}
        onChange={onChangeStatus}
        isLoading={isLoading}
        count={count}
      />
    );
  }

  return <ViewMetaBar view={view} isLoading={isLoading} count={count} />;
}
