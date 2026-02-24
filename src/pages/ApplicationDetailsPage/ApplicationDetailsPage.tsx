import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthSelectors } from "src/entities/auth";
import {
  type ApplicationDoc,
  type ProcessStatus,
  type HistoryEventDoc,
  getApplication,
  getApplicationHistory,
  changeStatus,
  addComment,
} from "src/features/applications/firestoreApplications";
import { db } from "src/shared/config/firebase/firebase";
import { Button, Card, InlineError } from "src/shared/ui";
import { Input } from "src/shared/ui/Form/Input";


function statusLabel(status: ProcessStatus): string {
  switch (status) {
    case "SAVED":
      return "SAVED";
    case "PLANNED":
      return "PLANNED";
    case "APPLIED":
      return "APPLIED";
    case "VIEWED":
      return "VIEWED";
    case "INTERVIEW_1":
      return "INTERVIEW";
    case "INTERVIEW_2":
      return "INTERVIEW 2";
    case "TEST_TASK":
      return "TEST TASK";
    case "OFFER":
      return "OFFER";
    case "REJECTED":
      return "REJECTED";
    case "NO_RESPONSE":
      return "NO RESPONSE";
    default:
      return status;
  }
}

const STATUS_BUTTONS: ProcessStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEW_1",
  "OFFER",
  "REJECTED",
  "NO_RESPONSE",
];

function formatTs(ts: any): string {
  if (!ts) return "";
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

function historyTitle(ev: HistoryEventDoc): string {
  if (ev.type === "STATUS_CHANGE") return `Status: ${ev.fromStatus} → ${ev.toStatus}`;
  if (ev.type === "COMMENT") return `Comment`;
  if (ev.type === "FIELD_CHANGE") return `Field: ${ev.fieldPath}`;
  return ev.comment ? ev.comment : "System";
}

export default function ApplicationDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appId } = useParams<{ appId: string }>();
  const { userId, isAuthReady } = useAuthSelectors();

  const [app, setApp] = useState<ApplicationDoc | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; data: HistoryEventDoc }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");

  const title = useMemo(() => {
    if (!app) return "";
    return `${app.job.roleTitle} • ${app.job.companyName}`;
  }, [app]);

  async function load() {
    if (!userId || !appId) return;
    setIsLoading(true);
    setError(null);
    try {
      const a = await getApplication(db, userId, appId);
      setApp(a);
      const h = await getApplicationHistory(db, userId, appId, 50);
      setHistory(h);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthReady || !userId || !appId) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthReady, userId, appId]);

  async function onChangeStatus(next: ProcessStatus) {
    if (!userId || !appId) return;
    setIsMutating(true);
    setError(null);
    try {
      await changeStatus(db, userId, appId, next);
      await load();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setIsMutating(false);
    }
  }

  async function onAddComment() {
    if (!userId || !appId) return;
    const text = commentText.trim();
    if (!text) return;

    setIsMutating(true);
    setError(null);
    try {
      await addComment(db, userId, appId, { text });
      setCommentText("");
      await load();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="space-y-lg">
      <div className="flex items-start justify-between gap-md">
        <div>
          <div className="text-sm text-muted-foreground">
            <button type="button" className="hover:underline" onClick={() => navigate("/dashboard/applications")}>
              {t("applicationDetails.back", "← Back to applications")}
            </button>
          </div>
          <div className="text-xl font-semibold text-foreground">
            {title || t("applicationDetails.titleFallback", "Application")}
          </div>
          {app?.job.vacancyUrl ? (
            <div className="text-sm text-muted-foreground break-all">
              <a className="hover:underline" href={app.job.vacancyUrl} target="_blank" rel="noreferrer">
                {app.job.vacancyUrl}
              </a>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-sm">
          <div className="rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-foreground">
            {app ? statusLabel(app.process.status) : "—"}
          </div>
          {app?.priority ? (
            <div className="rounded-full border border-border bg-background px-3 py-1 text-[12px] font-medium text-foreground">
              {t("applicationDetails.priority", "Priority")}: {app.priority.score}
            </div>
          ) : null}
        </div>
      </div>

      {error ? <InlineError message={error} /> : null}

      <Card padding="md" shadow="sm" className="space-y-md">
        <div className="text-base font-semibold">{t("applicationDetails.actions", "Actions")}</div>
        <div className="flex flex-wrap gap-sm">
          {STATUS_BUTTONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={app?.process.status === s ? "default" : "outline"}
              disabled={!app || isMutating}
              onClick={() => onChangeStatus(s)}
            >
              {statusLabel(s)}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold">{t("applicationDetails.comment", "Add comment")}</div>
          <div className="flex gap-sm">
            <Input
              preset="default"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("applicationDetails.commentPh", "Write a short note…")}
            />
            <Button disabled={!commentText.trim() || isMutating} onClick={onAddComment}>
              {t("applicationDetails.add", "Add")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        <Card padding="md" shadow="sm" className="space-y-sm">
          <div className="text-base font-semibold">{t("applicationDetails.summary", "Summary")}</div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">{t("applicationDetails.loading", "Loading…")}</div>
          ) : !app ? (
            <div className="text-sm text-muted-foreground">{t("applicationDetails.notFound", "Not found")}</div>
          ) : (
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">{t("applicationDetails.company","Company")}:</span> {app.job.companyName}</div>
              <div><span className="text-muted-foreground">{t("applicationDetails.role","Role")}:</span> {app.job.roleTitle}</div>
              <div><span className="text-muted-foreground">{t("applicationDetails.source","Source")}:</span> {app.job.source || "—"}</div>
              <div><span className="text-muted-foreground">{t("applicationDetails.status","Status")}:</span> {statusLabel(app.process.status)}</div>
              <div><span className="text-muted-foreground">{t("applicationDetails.followup","Follow-up")}:</span> {app.process.needsFollowUp ? t("applicationDetails.yes","Yes") : t("applicationDetails.no","No")} {app.process.followUpDueAt ? `(${formatTs(app.process.followUpDueAt)})` : ""}</div>
              <div><span className="text-muted-foreground">{t("applicationDetails.reapply","Re-apply")}:</span> {app.process.needsReapplySuggestion ? t("applicationDetails.yes","Yes") : t("applicationDetails.no","No")} {app.process.reapplyEligibleAt ? `(${formatTs(app.process.reapplyEligibleAt)})` : ""}</div>
            </div>
          )}
        </Card>

        <Card padding="md" shadow="sm" className="space-y-sm">
          <div className="text-base font-semibold">{t("applicationDetails.matching","Matching")}</div>
          {!app?.matching ? (
            <div className="text-sm text-muted-foreground">{t("applicationDetails.noMatching","No matching data yet. Add description or skills.")}</div>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t("applicationDetails.decision","Decision")}:</span>{" "}
                <span className="font-medium">{app.matching.decision}</span>{" "}
                <span className="text-muted-foreground">({app.matching.score}/100)</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("applicationDetails.matched","Matched")}:</span>{" "}
                {app.matching.matchedSkillsTop.length ? app.matching.matchedSkillsTop.join(", ") : "—"}
              </div>
              <div>
                <span className="text-muted-foreground">{t("applicationDetails.gaps","Gaps")}:</span>{" "}
                {app.matching.gapsTop.length ? app.matching.gapsTop.join(", ") : "—"}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("applicationDetails.computedAt","Computed")} {formatTs(app.matching.computedAt)} • {t("applicationDetails.confidence","Confidence")} {Math.round(app.matching.confidence * 100)}%
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card padding="md" shadow="sm" className="space-y-sm">
        <div className="text-base font-semibold">{t("applicationDetails.history","History")}</div>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t("applicationDetails.noHistory","No history yet.")}</div>
        ) : (
          <div className="divide-y divide-border">
            {history.map((h) => (
              <div key={h.id} className="py-sm">
                <div className="text-sm font-medium text-foreground">{historyTitle(h.data)}</div>
                <div className="text-xs text-muted-foreground">
                  {formatTs(h.data.createdAt)} • {h.data.actor}
                </div>
                {h.data.comment ? (
                  <div className="mt-1 text-sm text-foreground">{h.data.comment}</div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
