import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useJobs } from "src/entities/job/api/useJobs";
import { useAuth } from "src/shared/lib";
import {
  DashboardOnboardingActions,
  DashboardPipelineCard,
  DashboardRecentJobsCard,
  DashboardStats,
} from "./components";

type Status = "saved" | "applied" | "interview" | "rejected";

type JobLike = {
  id: string;
  createdAt?: unknown;
  title?: string | null;
  company?: string | null;
  status?: unknown;
};

const ROUTES = {
  profile: "/dashboard/profile",
  questions: "/dashboard/profile/questions",
  loop: "/dashboard/loop",
  jobs: "/dashboard/jobs",
} as const;

function isStatus(v: unknown): v is Status {
  return (
    v === "saved" || v === "applied" || v === "interview" || v === "rejected"
  );
}

function buildSummary(statuses: Status[]) {
  const s = { total: 0, saved: 0, applied: 0, interview: 0, rejected: 0 };
  for (const st of statuses) {
    s.total += 1;
    s[st] += 1;
  }
  return s;
}

function toMillis(value: unknown): number {
  if (
    value &&
    typeof (value as { toMillis?: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (typeof value === "number") return value;
  return 0;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { jobs, isLoading, error } = useJobs(user?.uid);

  const summary = useMemo(() => {
    const statuses = (jobs as JobLike[]).map((j) => j.status).filter(isStatus);
    return buildSummary(statuses);
  }, [jobs]);

  const hasJobs = summary.total > 0;

  const recent = useMemo(() => {
    const copy = [...(jobs as JobLike[])];
    copy.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    return copy.slice(0, 5);
  }, [jobs]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-sm font-semibold text-foreground">
          You&apos;re almost there!
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DashboardOnboardingActions
            hasJobs={hasJobs}
            onGoProfile={() => navigate(ROUTES.profile)}
            onGoQuestions={() => navigate(ROUTES.questions)}
            onGoLoop={() => navigate(ROUTES.loop)}
            onGoJobs={() => navigate(ROUTES.jobs)}
          />

          <DashboardRecentJobsCard
            jobs={recent}
            onViewAll={() => navigate(ROUTES.jobs)}
          />

          <DashboardPipelineCard summary={summary} size={240} stroke={16} />
        </div>
      </div>

      <DashboardStats
        isLoading={isLoading}
        error={error}
        summary={summary}
        onGoJobs={(status) =>
          navigate(
            status ? `/dashboard/jobs?status=${status}` : "/dashboard/jobs"
          )
        }
        onAddFirstJob={() => navigate("/dashboard/jobs?focus=add")}
      />
    </div>
  );
}
