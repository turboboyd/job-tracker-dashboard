import { useTranslation } from "react-i18next";

import type { ProcessStatus } from "src/features/applications/firestoreApplications";
import { Button } from "src/shared/ui";

import { PIPELINE_STATUSES, processStatusKey } from "../model/types";

export function PipelineStatusTabs(props: {
  activeStatus: ProcessStatus;
  onChange: (status: ProcessStatus) => void;
  isLoading: boolean;
  count: number;
}) {
  const { t } = useTranslation();
  const { activeStatus, onChange, isLoading, count } = props;

  return (
    <div className="space-y-sm">
      <div className="flex flex-wrap items-center gap-sm">
        {PIPELINE_STATUSES.map((s) => (
          <Button
            key={s.key}
            variant={activeStatus === s.status ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(s.status)}
          >
            {t(
              `applicationsPage.pipeline.${s.key}`,
              t(processStatusKey(s.status), s.status)
            )}
          </Button>
        ))}
        <div className="ml-auto text-xs text-muted-foreground">
          {isLoading
            ? t("applicationsPage.pipeline.loading", "Loading…")
            : t("applicationsPage.pipeline.count", "Count: {{count}}", {
                count,
              })}
        </div>
      </div>
    </div>
  );
}
