import { Card } from "src/shared/ui/Card/Card";
import { DonutChart } from "src/shared/ui";

type Summary = {
  total: number;
  applied: number;
  saved: number;
  interview: number;
  rejected: number;
};

type Props = {
  summary: Summary;
  size?: number;
  stroke?: number;
};

export function DashboardPipelineCard({ summary, size = 240, stroke = 16 }: Props) {
  const submitted = summary.applied + summary.interview + summary.rejected;

  return (
    <Card radius="xl" padding="md">
      <div className="flex justify-center">
        <DonutChart
          title="Applications pipeline"
          totalLabel="Submitted"
          centerTop={`${submitted}`}
          centerBottom={`of ${summary.total} total`}
          size={size}
          stroke={stroke}
          slices={[
            { label: "Applied", value: summary.applied, className: "stroke-blue-500" },
            { label: "Interview", value: summary.interview, className: "stroke-purple-500" },
            { label: "Rejected", value: summary.rejected, className: "stroke-red-500" },
            { label: "Saved", value: summary.saved, className: "stroke-amber-500" },
          ]}
        />
      </div>
    </Card>
  );
}
