import React, { useMemo, useState } from "react";

import { useGetLoopsQuery } from "src/entities/loop/api/loopApi";
import { joinTitles } from "src/entities/loop/lib/format";
import { CreateLoopModal } from "src/entities/loop/ui/CreateLoopModal/CreateLoopModal";
import { normalizeError } from "src/shared/lib";
import { Button, Pagination } from "src/shared/ui";

import { Header } from "../../MatchesPage/components/LoopsHeader";

const PAGE_SIZE = 7;

export function LoopsListView({
  userId,
  onOpenLoop,
}: {
  userId: string;
  onOpenLoop: (id: string) => void;
}) {
  const loopsQ = useGetLoopsQuery({ userId });
  const [createOpen, setCreateOpen] = useState(false);

  const [page, setPage] = useState(1);

  const loops = loopsQ.data ?? [];

  const totalPages = useMemo(() => {
    const n = Math.ceil(loops.length / PAGE_SIZE);
    return n <= 0 ? 1 : n;
  }, [loops.length]);

  const pageItems = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return loops.slice(start, start + PAGE_SIZE);
  }, [loops, page, totalPages]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <Header
        title="My Loops"
        subtitle="Create a loop and track matches."
        right={
          <Button
            variant="default"
            shadow="sm"
            shape="lg"
            onClick={() => setCreateOpen(true)}
          >
            New loop
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-6">
        {loopsQ.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : loopsQ.isError ? (
          <div className="text-sm text-muted-foreground">
            {normalizeError(loopsQ.error)}
          </div>
        ) : loops.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No loops yet. Create your first loop.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {pageItems.map((l) => (
                <div
                  key={l.id}
                  tabIndex={0}
                  onClick={() => onOpenLoop(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenLoop(l.id);
                    }
                  }}
                  className={[
                    "w-full",
                    "rounded-xl border border-border bg-background",
                    "px-4 py-4",
                    "hover:bg-muted transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-border",
                    "cursor-pointer",
                    "select-none",
                  ].join(" ")}
                >
                  <div className="text-sm font-semibold text-foreground">
                    {l.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.location} · {joinTitles(l.titles) || "—"} ·{" "}
                    {l.remoteMode === "remote_only" ? "Remote" : "Any"}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 items-center">
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-medium">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>
                –
                <span className="text-foreground font-medium">
                  {Math.min(page * PAGE_SIZE, loops.length)}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-medium">
                  {loops.length}
                </span>
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                disabled={loopsQ.isFetching}
                siblingCount={1}
              />
            </div>
          </div>
        )}
      </div>

      <CreateLoopModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        userId={userId}
        onCreated={(id) => {
          onOpenLoop(id);
          setPage(1);
        }}
      />
    </div>
  );
}
