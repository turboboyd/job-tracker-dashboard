import { useTranslation } from "react-i18next";

import { Card } from "src/shared/ui";

import type { ViewMode } from "../model/types";
import type { AppRow } from "../model/useApplicationsPage";

import { ApplicationListItem } from "./ApplicationListItem";


export function ApplicationsListCard(props: { list: AppRow[]; view: ViewMode }) {
  const { t } = useTranslation();
  const { list, view } = props;

  const emptyText =
    view === "today"
      ? t("applicationsPage.empty.today", "Nothing for today.")
      : view === "followups"
        ? t("applicationsPage.empty.followups", "No follow-ups due.")
        : t("applicationsPage.empty.pipeline", "No applications yet.");

  return (
    <Card padding="md" shadow="sm" className="space-y-sm">
      {list.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {list.map((row) => (
            <div key={row.id} className="py-[2px]">
              <ApplicationListItem row={row} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
