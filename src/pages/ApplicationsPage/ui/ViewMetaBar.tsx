import { useTranslation } from "react-i18next";

import type { ViewMode } from "../model/types";

export function ViewMetaBar(props: {
  view: ViewMode;
  isLoading: boolean;
  count: number;
}) {
  const { t } = useTranslation();
  const { view, isLoading, count } = props;

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        {view === "today"
          ? t("applicationsPage.todayHint", "Sorted by priority.score")
          : t(
              "applicationsPage.followupsHint",
              "Needs follow-up ordered by due date"
            )}
      </div>
      <div className="text-xs text-muted-foreground">
        {isLoading
          ? t("applicationsPage.pipeline.loading", "Loading…")
          : t("applicationsPage.pipeline.count", "Count: {{count}}", { count })}
      </div>
    </div>
  );
}
