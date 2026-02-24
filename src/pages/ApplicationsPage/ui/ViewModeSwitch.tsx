import { useTranslation } from "react-i18next";

import { Button } from "src/shared/ui";

import type { ViewMode } from "../model/types";

export function ViewModeSwitch(props: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  const { t } = useTranslation();
  const { value, onChange } = props;

  return (
    <div className="flex items-center gap-sm">
      <Button
        size="sm"
        variant={value === "pipeline" ? "default" : "outline"}
        onClick={() => onChange("pipeline")}
      >
        {t("applicationsPage.views.pipeline", "Pipeline")}
      </Button>
      <Button
        size="sm"
        variant={value === "today" ? "default" : "outline"}
        onClick={() => onChange("today")}
      >
        {t("applicationsPage.views.today", "Today")}
      </Button>
      <Button
        size="sm"
        variant={value === "followups" ? "default" : "outline"}
        onClick={() => onChange("followups")}
      >
        {t("applicationsPage.views.followups", "Follow-ups")}
      </Button>
    </div>
  );
}
