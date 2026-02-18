import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DonutChart } from "src/shared/ui";
import { Card } from "src/shared/ui/Card/Card";

type Summary = {
  total: number;
  new: number;
  applied: number;
  saved: number;
  interview: number;
  offer: number;
  rejected: number;
};

type Props = {
  summary: Summary;
  size?: number;
  stroke?: number;
};

export function DashboardPipelineCard({
  summary,
  size,
  stroke,
}: Props) {
   const { t } = useTranslation(undefined, { keyPrefix: "dashboard" });

  const [vw, setVw] = useState<number>(() => {
    if (typeof window === "undefined") return 1024;
    return window.innerWidth;
  });

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const computed = useMemo(() => {
    if (vw <= 360) return { size: 200, stroke: 14 };
    if (vw <= 640) return { size: 220, stroke: 15 };
    return { size: 240, stroke: 16 };
  }, [vw]);

  const donutSize = size ?? computed.size;
  const donutStroke = stroke ?? computed.stroke;


  const inPipeline =
    summary.new +
    summary.applied +
    summary.interview +
    summary.offer +
    summary.rejected;

  return (
    <Card padding="md" className="rounded-3xl p-4 sm:p-6">
      <div className="flex justify-center">
        <DonutChart
          title={t("pipeline.title", "Applications pipeline")}
          totalLabel={t("pipeline.totalLabel", "In pipeline")}
          centerTop={`${inPipeline}`}
          centerBottom={t("pipeline.centerBottom", "of {{total}} total", {
            total: summary.total,
          })}
          size={donutSize}
          stroke={donutStroke}
          slices={[
            {
              label: t("status.new", "New"),
              value: summary.new,
              className: "stroke-sky-500",
            },
            {
              label: t("status.applied", "Applied"),
              value: summary.applied,
              className: "stroke-blue-500",
            },
            {
              label: t("status.interview", "Interview"),
              value: summary.interview,
              className: "stroke-purple-500",
            },
            {
              label: t("status.offer", "Offer"),
              value: summary.offer,
              className: "stroke-emerald-500",
            },
            {
              label: t("status.rejected", "Rejected"),
              value: summary.rejected,
              className: "stroke-red-500",
            },
          ]}
        />
      </div>
    </Card>
  );
}
