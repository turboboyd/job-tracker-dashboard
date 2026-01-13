import { Card } from "src/shared/ui/Card/Card";
import { Button } from "src/shared/ui";

export type RecentJob = {
  id: string;
  title?: string | null;
  company?: string | null;
  status?: unknown;
  createdAt?: unknown; 
};

type Props = {
  jobs: RecentJob[];
  onViewAll: () => void;
  onOpenJob?: (jobId: string) => void; 
};

function toMillis(value: unknown): number | null {
  if (!value) return null;

  if (typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }

  if (typeof value === "number") return value;


  const seconds = (value as { seconds?: unknown }).seconds;
  if (typeof seconds === "number") return seconds * 1000;

  return null;
}

function formatRelative(ms: number | null): string | null {
  if (!ms) return null;

  const diff = Date.now() - ms;
  if (diff < 0) return "just now";

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function DashboardRecentJobsCard({ jobs, onViewAll, onOpenJob }: Props) {
  return (
    <Card radius="xl" padding="md">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-foreground">Recent jobs</div>
        <Button variant="link" className="px-0" onClick={onViewAll}>
          View all
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-3 text-sm text-muted-foreground">
          No jobs yet. Add your first job to see activity here.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {jobs.map((j) => {
            const rel = formatRelative(toMillis(j.createdAt));

            return (
              <button
                key={j.id}
                type="button"
                onClick={() => (onOpenJob ? onOpenJob(j.id) : onViewAll())}
                className={[
                  "w-full text-left",
                  "rounded-lg border border-border bg-background p-3",
                  "transition-colors",
                  "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
                  "cursor-pointer",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">
                      {j.title || "Untitled role"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {j.company || "Company"}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-foreground">
                      {String(j.status || "").toUpperCase() || "—"}
                    </div>

                    {rel && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Created {rel}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
