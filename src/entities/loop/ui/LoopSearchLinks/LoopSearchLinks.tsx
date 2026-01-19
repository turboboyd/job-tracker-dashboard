import React, { useMemo, useState } from "react";

import { useUpdateLoopMutation } from "src/entities/loop/api/loopApi";
import { mapWorkModeToRemoteMode, openUrl } from "src/entities/loop/lib";
import type { LoopPlatform, Loop } from "src/entities/loop/model";
import { normalizeRoleToTitles } from "src/entities/loop/model";
import { AddMatchModal } from "src/entities/loop/ui/AddMatchModal/AddMatchModal";
import { EditSourcesModal } from "src/entities/loop/ui/EditSourcesModal/EditSourcesModal";
import { LoopSettingsModal } from "src/entities/loop/ui/LoopSettingsModal/LoopSettingsModal";
import { getErrorMessage } from "src/shared/lib/errors";
import { usePagination } from "src/shared/lib/pagination/usePagination";
import { Button, Pagination } from "src/shared/ui";

import { PlatformLinkCard } from "./components/PlatformLinkCard";
import type { LoopForLinks } from "./types";
import { useLoopSearchLinksState } from "./useLoopSearchLinksState";

type Props = {
  loop: Pick<
    Loop,
    | "id"
    | "name"
    | "titles"
    | "location"
    | "radiusKm"
    | "platforms"
    | "remoteMode"
    | "filters"
  >;
  userId: string | null;
};



export function LoopSearchLinks({ loop, userId }: Props) {
  const [updateLoop, updateState] = useUpdateLoopMutation();

  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState(false);
  const [defaultPlatform, setDefaultPlatform] = useState<
    LoopPlatform | undefined
  >(undefined);

  const loopForState = loop as unknown as LoopForLinks;


  const {
    draftFilters,
    setDraftFilters,
    applyDraftFilters,
    resetFilters,
    appliedFilters,
    activeLink,
    setActive,
    links,
  } = useLoopSearchLinksState(loopForState);

  const isSaving = updateState.isLoading;
  const canEditSources = Boolean(userId) && !isSaving;

  const linksPager = usePagination({
    totalItems: links.length,
    pageSize: 12,
    resetKey: loop.id,
  });

  const pagedLinks = useMemo(() => {
    return links.slice(linksPager.offset, linksPager.offset + linksPager.limit);
  }, [links, linksPager.offset, linksPager.limit]);

  const handleApply = async () => {
    applyDraftFilters();
    linksPager.setPage(1);

    if (!userId) return;

    try {
      await updateLoop({
        loopId: loop.id,
        name: loop.name,
        titles: normalizeRoleToTitles(draftFilters.role),
        location: draftFilters.location,
        radiusKm: draftFilters.radiusKm,
        remoteMode: mapWorkModeToRemoteMode(draftFilters.workMode),
        filters: draftFilters,
      }).unwrap();

      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Failed to save filters:", getErrorMessage(err));
    }
  };

  const appliedBadges = useMemo(() => {
    const out: string[] = [];
    if (appliedFilters.role.trim())
      out.push(`Role: ${appliedFilters.role.trim()}`);
    if (appliedFilters.location.trim())
      out.push(`Loc: ${appliedFilters.location.trim()}`);
    out.push(`Radius: ${appliedFilters.radiusKm}km`);
    if (appliedFilters.workMode !== "any")
      out.push(`Mode: ${appliedFilters.workMode}`);
    out.push(`Posted: ${appliedFilters.postedWithin}d`);
    return out;
  }, [appliedFilters]);

  const openAddModal = (platform?: LoopPlatform) => {
    setDefaultPlatform(platform);
    setIsAddMatchModalOpen(true);
  };

  const handleOpenLink = (platform: LoopPlatform, url: string) => {
    setActive(platform, url);
    openUrl(url);
  };

  return (
    <div className="space-y-4">
      <LoopSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        value={draftFilters}
        onChange={setDraftFilters}
        disabled={isSaving}
        onApply={handleApply}
        onReset={() => {
          resetFilters();
          linksPager.setPage(1);
        }}
      />

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                Search links
              </h3>

              <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Showing {linksPager.info.from}–{linksPager.info.to} of{" "}
                {links.length}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Apply filters → open platform → pick a job → paste URL → save
              match.
            </p>

            {appliedBadges.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {appliedBadges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              shape="lg"
              onClick={() => setIsSettingsOpen(true)}
              disabled={isSaving}
            >
              My Loop settings
            </Button>

            <Button
              variant="outline"
              shape="lg"
              onClick={() => setIsSourcesModalOpen(true)}
              disabled={!canEditSources}
            >
              Edit sources
            </Button>

            <Button
              variant="default"
              shape="lg"
              shadow="sm"
              onClick={() => openAddModal(undefined)}
              disabled={!userId}
            >
              Add match
            </Button>
          </div>

          <EditSourcesModal
            open={isSourcesModalOpen}
            onOpenChange={setIsSourcesModalOpen}
            value={loop.platforms}
            disabled={!canEditSources}
            onSave={async (nextPlatforms) => {
              if (!userId) return;
              try {
                await updateLoop({
                  loopId: loop.id,
                  platforms: nextPlatforms,
                }).unwrap();
              } catch (err) {
                console.error(
                  "Failed to update sources:",
                  getErrorMessage(err)
                );
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {pagedLinks.map((link) => {
            const isActive =
              activeLink?.platform === link.platform &&
              activeLink?.url === link.url;

            return (
              <PlatformLinkCard
                key={link.platform}
                platform={link.platform}
                url={link.url}
                isActive={isActive}
                onOpen={() => handleOpenLink(link.platform, link.url)}
                onAdd={() => openAddModal(link.platform)}
                addDisabled={!userId}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-center">
          <Pagination
            page={linksPager.page}
            totalPages={linksPager.totalPages}
            onPageChange={linksPager.setPage}
            disabled={isSaving}
          />
        </div>

        <AddMatchModal
          open={isAddMatchModalOpen}
          onOpenChange={setIsAddMatchModalOpen}
          userId={userId}
          loopId={loop.id}
          defaultPlatform={defaultPlatform}
        />
      </div>
    </div>
  );
}
