import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildCanonicalFiltersFromLoop,
  mapCanonicalToSearchFilters,
  buildSearchLinks,
} from "src/entities/loop/lib";
import  {
  type CanonicalFilters,
DEFAULT_CANONICAL_FILTERS,
type LoopPlatform
} from "src/entities/loop/model";



import type { ActiveLink, LoopForLinks } from "./types";

function filtersEqual(a: CanonicalFilters, b: CanonicalFilters) {
  const keys = Object.keys(DEFAULT_CANONICAL_FILTERS) as Array<
    keyof CanonicalFilters
  >;
  for (const k of keys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

/**
 * Filters UX:
 * - draftFilters: editable (does NOT refresh links)
 * - appliedFilters: applied snapshot (DOES refresh links)
 *
 * Sync:
 * - loop.id changes -> hard reset
 * - loop updates same id -> sync only if user has no unsaved edits
 */
export function useLoopSearchLinksState(loop: LoopForLinks) {
const baseFromLoop = useMemo(() => buildCanonicalFiltersFromLoop(loop), [loop]);


  const [draftFilters, _setDraftFilters] = useState<CanonicalFilters>(
    () => baseFromLoop
  );
  const [appliedFilters, setAppliedFilters] = useState<CanonicalFilters>(
    () => baseFromLoop
  );
  const [activeLink, setActiveLink] = useState<ActiveLink>(null);
  const [isDirty, setIsDirty] = useState(false);

  // loop changed -> always reset
  useEffect(() => {
    _setDraftFilters(baseFromLoop);
    setAppliedFilters(baseFromLoop);
    setActiveLink(null);
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop.id]);

  // loop updated (same id) -> sync only if no unsaved edits
  useEffect(() => {
    if (isDirty) return;

    _setDraftFilters((prev) =>
      filtersEqual(prev, baseFromLoop) ? prev : baseFromLoop
    );
    setAppliedFilters((prev) =>
      filtersEqual(prev, baseFromLoop) ? prev : baseFromLoop
    );
    setActiveLink(null);
  }, [baseFromLoop, isDirty]);

  const setDraftFilters = useCallback(
    (next: CanonicalFilters) => {
      _setDraftFilters(next);
      setIsDirty(!filtersEqual(next, baseFromLoop));
    },
    [baseFromLoop]
  );

  const links = useMemo(() => {
    return buildSearchLinks(
      loop.platforms as LoopPlatform[],
      mapCanonicalToSearchFilters(appliedFilters)
    );
  }, [loop.platforms, appliedFilters]);

  const resetFilters = useCallback(() => {
    _setDraftFilters(baseFromLoop);
    setAppliedFilters(baseFromLoop);
    setActiveLink(null);
    setIsDirty(false);
  }, [baseFromLoop]);

  const applyDraftFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
    setActiveLink(null);
    setIsDirty(false);
  }, [draftFilters]);

  const setActive = useCallback((platform: LoopPlatform, url: string) => {
    setActiveLink({ platform, url });
  }, []);

  return {
    draftFilters,
    setDraftFilters,

    appliedFilters,
    applyDraftFilters,
    resetFilters,

    activeLink,
    setActiveLink,
    setActive,

    links,
  };
}
