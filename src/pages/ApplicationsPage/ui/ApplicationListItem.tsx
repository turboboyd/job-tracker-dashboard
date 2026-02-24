import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { processStatusKey } from "../model/types";
import type { AppRow } from "../model/useApplicationsPage";

export function ApplicationListItem(props: { row: AppRow }) {
  const { row } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/dashboard/applications/${row.id}`)}
      className="w-full py-sm flex items-center gap-md text-left hover:bg-muted/40 rounded-md px-2"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {row.data.job.roleTitle}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {row.data.job.companyName}
          {row.data.job.source ? ` • ${row.data.job.source}` : ""}
        </div>
        {row.data.matching ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            {t("applicationsPage.matching", "Match")}: {row.data.matching.score}
            /100 • {row.data.matching.decision}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-sm shrink-0">
        {row.data.process.needsFollowUp ? (
          <span className="rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground">
            {t("applicationsPage.followUpBadge", "Follow-up")}
          </span>
        ) : null}
        <div className="rounded-full border border-border bg-muted px-sm py-1 text-[11px] font-medium text-foreground">
          {t(processStatusKey(row.data.process.status), row.data.process.status)}
        </div>
      </div>
    </button>
  );
}
