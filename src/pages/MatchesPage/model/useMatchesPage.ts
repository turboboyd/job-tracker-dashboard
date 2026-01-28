import React from "react";

import type { TypeMatch, MatchesFiltersState } from "src/entities/match/model";
import { matchesFiltersDefaults, selectVisibleMatches } from "src/entities/match/model";

export function useMatchesPage(args: { matches: TypeMatch[] }) {
  const { matches } = args;

  const [filters, setFilters] = React.useState<MatchesFiltersState>(matchesFiltersDefaults);

  const visible = React.useMemo(() => {
    return selectVisibleMatches(matches, filters);
  }, [matches, filters]);

  const reset = React.useCallback(() => setFilters(matchesFiltersDefaults), []);

  return { filters, setFilters, reset, visible };
}
