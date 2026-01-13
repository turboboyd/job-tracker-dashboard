import { Card } from "src/shared/ui/Card/Card";
import { KpiCard, CardButton, Button } from "src/shared/ui";
import { DashboardIcon } from "../DashboardIcon";

type Summary = {
  total: number;
  applied: number;
  saved: number;
  interview: number;
  rejected: number;
};

type Status = "saved" | "applied" | "interview" | "rejected";

type Props = {
  isLoading: boolean;
  error?: string | null;
  summary: Summary;
  onGoJobs?: (status?: Status) => void;

  // ✅ новый проп для CTA (когда total=0)
  onAddFirstJob?: () => void;
};

export function DashboardStats({
  isLoading,
  error,
  summary,
  onGoJobs,
  onAddFirstJob,
}: Props) {
  if (isLoading) {
    return (
      <Card radius="xl" padding="md">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card radius="xl" padding="md">
        <div className="text-sm font-medium text-foreground">Couldn’t load jobs</div>
        <div className="mt-1 text-sm text-muted-foreground">{error}</div>
      </Card>
    );
  }

  // ✅ Умный empty state
  if (summary.total === 0) {
    return (
      <Card radius="xl" padding="md">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground">
              Add your first job
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Start tracking your applications — your statistics will appear here.
            </div>
          </div>

          <Button variant="outline" shadow="sm" onClick={onAddFirstJob}>
            Add job
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat label="Applied" value={0} />
          <MiniStat label="Saved" value={0} />
          <MiniStat label="Interview" value={0} />
          <MiniStat label="Rejected" value={0} />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold text-foreground">Statistics</div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <CardButton onClick={() => onGoJobs?.()}>
          <KpiCard title="Total jobs" value={summary.total} icon={<DashboardIcon name="total" />} />
        </CardButton>

        <CardButton onClick={() => onGoJobs?.("applied")}>
          <KpiCard title="Applied" value={summary.applied} icon={<DashboardIcon name="applied" />} />
        </CardButton>

        <CardButton onClick={() => onGoJobs?.("saved")}>
          <KpiCard title="Saved" value={summary.saved} icon={<DashboardIcon name="saved" />} />
        </CardButton>

        <CardButton onClick={() => onGoJobs?.("interview")}>
          <KpiCard title="Interview" value={summary.interview} icon={<DashboardIcon name="interview" />} />
        </CardButton>

        <CardButton onClick={() => onGoJobs?.("rejected")}>
          <KpiCard title="Rejected" value={summary.rejected} icon={<DashboardIcon name="rejected" />} />
        </CardButton>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
