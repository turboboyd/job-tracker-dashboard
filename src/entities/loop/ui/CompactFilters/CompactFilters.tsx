import { useMemo, useState } from "react";

import type { CanonicalFilters } from "src/entities/loop/model";
import { Button, FormField, Input } from "src/shared/ui";

const RADIUS_OPTIONS: CanonicalFilters["radiusKm"][] = [5, 10, 20, 30, 50, 100];
const POSTED_WITHIN_OPTIONS: CanonicalFilters["postedWithin"][] = [
  1, 3, 7, 14, 30,
];

const WORK_MODE_OPTIONS: Array<{
  value: CanonicalFilters["workMode"];
  label: string;
}> = [
  { value: "any", label: "Any" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
  { value: "remote_only", label: "Remote-only" },
];

const SENIORITY_OPTIONS: Array<{
  value: CanonicalFilters["seniority"];
  label: string;
}> = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const EMPLOYMENT_OPTIONS: Array<{
  value: CanonicalFilters["employmentType"];
  label: string;
}> = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "ausbildung", label: "Ausbildung" },
];

const LANGUAGE_OPTIONS: Array<{
  value: CanonicalFilters["language"];
  label: string;
}> = [
  { value: "any", label: "Any" },
  { value: "de", label: "DE" },
  { value: "en", label: "EN" },
];

type Props = {
  value: CanonicalFilters;
  onChange: (next: CanonicalFilters) => void;

  onApply: () => void;
  onReset: () => void;

  disabled?: boolean;
};

function parseKeywordLine(v: string) {
  return v.replace(/\s+/g, " ").trim();
}

export function CompactFilters({
  value,
  onChange,
  onApply,
  onReset,
  disabled,
}: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const badges = useMemo(() => {
    const out: string[] = [];
    if (value.role.trim()) out.push(`Role: ${value.role.trim()}`);
    if (value.location.trim()) out.push(`Loc: ${value.location.trim()}`);
    out.push(`Radius: ${value.radiusKm}km`);
    if (value.workMode !== "any") out.push(`Mode: ${value.workMode}`);
    out.push(`Posted: ${value.postedWithin}d`);
    return out;
  }, [value]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-foreground">Filters</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Update → Apply → links refresh & saved to loop.
          </div>

          {badges.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((b) => (
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
            variant="default"
            shadow="sm"
            shape="lg"
            onClick={onApply}
            disabled={disabled}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            shape="lg"
            onClick={onReset}
            disabled={disabled}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <FormField label="Profession / Role">
            <Input
              value={value.role}
              onChange={(e) => onChange({ ...value, role: e.target.value })}
              placeholder="Fachinformatiker OR React Developer"
              disabled={disabled}
            />
          </FormField>
        </div>

        <div className="md:col-span-4">
          <FormField label="Location">
            <Input
              value={value.location}
              onChange={(e) => onChange({ ...value, location: e.target.value })}
              placeholder="Berlin"
              disabled={disabled}
            />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label="Radius">
            <select
              value={value.radiusKm}
              onChange={(e) =>
                onChange({
                  ...value,
                  radiusKm: Number(
                    e.target.value
                  ) as CanonicalFilters["radiusKm"],
                })
              }
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
              disabled={disabled}
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="md:col-span-1">
          <FormField label=" " hint="">
            <Button
              variant="outline"
              shape="lg"
              className="w-full"
              onClick={() => setAdvancedOpen((v) => !v)}
              disabled={disabled}
            >
              {advancedOpen ? "Less" : "More"}
            </Button>
          </FormField>
        </div>
      </div>

      {advancedOpen ? (
        <div className="rounded-2xl border border-border bg-background p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-3">
              <FormField label="Work mode">
                <select
                  value={value.workMode}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      workMode: e.target.value as CanonicalFilters["workMode"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                  disabled={disabled}
                >
                  {WORK_MODE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="md:col-span-3">
              <FormField label="Seniority">
                <select
                  value={value.seniority}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      seniority: e.target
                        .value as CanonicalFilters["seniority"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                  disabled={disabled}
                >
                  {SENIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="md:col-span-3">
              <FormField label="Employment type">
                <select
                  value={value.employmentType}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      employmentType: e.target
                        .value as CanonicalFilters["employmentType"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                  disabled={disabled}
                >
                  {EMPLOYMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="md:col-span-3">
              <FormField label="Posted within">
                <select
                  value={value.postedWithin}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      postedWithin: Number(
                        e.target.value
                      ) as CanonicalFilters["postedWithin"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                  disabled={disabled}
                >
                  {POSTED_WITHIN_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} days
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <FormField
                label="Include keywords"
                hint="Optional, will be appended to search query"
              >
                <Input
                  value={value.includeKeywords}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      includeKeywords: parseKeywordLine(e.target.value),
                    })
                  }
                  placeholder="react typescript next"
                  disabled={disabled}
                />
              </FormField>
            </div>

            <div className="md:col-span-6">
              <FormField
                label="Exclude keywords"
                hint="Optional, will be appended as exclusions"
              >
                <Input
                  value={value.excludeKeywords}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      excludeKeywords: parseKeywordLine(e.target.value),
                    })
                  }
                  placeholder="senior lead manager zeitarbeit"
                  disabled={disabled}
                />
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-3">
              <FormField label="Language">
                <select
                  value={value.language}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      language: e.target.value as CanonicalFilters["language"],
                    })
                  }
                  className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
                  disabled={disabled}
                >
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="md:col-span-4 flex items-end">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={value.excludeAgencies}
                  onChange={(e) =>
                    onChange({ ...value, excludeAgencies: e.target.checked })
                  }
                  disabled={disabled}
                />
                Exclude agencies / Zeitarbeit
              </label>
            </div>

            <div className="md:col-span-5" />
          </div>

          <div className="text-xs text-muted-foreground">
            Advanced filters are stored in <code>loop.filters</code>. URL
            builders can be extended later per platform.
          </div>
        </div>
      ) : null}
    </div>
  );
}
