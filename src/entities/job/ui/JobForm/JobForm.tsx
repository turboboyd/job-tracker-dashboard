import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";

import { jobFormToPatch } from "src/entities/job/model/formMapper";
import type { Job, JobSource, JobStatus } from "src/entities/job/model/types";
import { Button, Input, Textarea, InlineError } from "src/shared/ui";
import { FormField } from "src/shared/ui/FormField/FormField";

export type JobFormValues = {
  title: string;
  company: string;
  location: string;
  url: string;
  status: JobStatus;
  source: JobSource;
  notes: string;
};

const STATUS_OPTIONS: Array<{ value: JobStatus; label: string }> = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
];

const SOURCE_OPTIONS: Array<{ value: JobSource; label: string }> = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "company", label: "Company site" },
  { value: "other", label: "Other" },
];

function makeInitialValues(job?: Job | null): JobFormValues {
  return {
    title: job?.title ?? "",
    company: job?.company ?? "",
    location: job?.location ?? "",
    url: job?.url ?? "",
    status: (job?.status ?? "saved") as JobStatus,
    source: (job?.source ?? "other") as JobSource,
    notes: job?.notes ?? "",
  };
}

const schema: Yup.ObjectSchema<JobFormValues> = Yup.object({
  title: Yup.string().trim().min(2, "Title is required").required("Title is required"),
  company: Yup.string().trim().min(2, "Company is required").required("Company is required"),
  location: Yup.string().trim().min(2, "Location is required").required("Location is required"),
  url: Yup.string()
    .trim()
    .required("URL is required")
    .test("is-url", "Invalid URL", (v) => {
      try {
        new URL(v!);
        return true;
      } catch {
        return false;
      }
    }),
  status: Yup.mixed<JobStatus>().oneOf(["saved", "applied", "interview", "rejected"]).required(),
  source: Yup.mixed<JobSource>().oneOf(["linkedin", "indeed", "company", "other"]).required(),
  notes: Yup.string().trim().min(1, "Notes are required").required("Notes are required"),
});

type Props = {
  job?: Job | null;

  submitLabel: string;
  onCancel?: () => void;
  isSubmittingExternal?: boolean;
  errorExternal?: string | null;

  onSubmit: (patch: ReturnType<typeof jobFormToPatch>) => Promise<void>;
};

export function JobForm({
  job,
  submitLabel,
  onCancel,
  isSubmittingExternal,
  errorExternal,
  onSubmit,
}: Props) {
  return (
    <Formik<JobFormValues>
      initialValues={makeInitialValues(job)}
      enableReinitialize
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(undefined);

        try {
          const patch = jobFormToPatch(values);
          await onSubmit(patch);
        } catch (e) {
          helpers.setStatus(e instanceof Error ? e.message : "Failed to save");
        }
      }}
    >
      {(f) => {
        const commonError =
          errorExternal ?? (typeof f.status === "string" ? f.status : undefined);

        const disabled = Boolean(isSubmittingExternal) || f.isSubmitting;
        const canSubmit = !disabled && f.dirty;

        return (
          <form onSubmit={f.handleSubmit} className="space-y-4">
            {commonError ? <InlineError message={commonError} /> : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Title"
                required
                error={f.touched.title ? (f.errors.title as string | undefined) : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="title"
                    value={f.values.title}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    placeholder="Frontend Developer"
                    state={invalid ? "error" : "default"}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    disabled={disabled}
                  />
                )}
              </FormField>

              <FormField
                label="Company"
                required
                error={f.touched.company ? (f.errors.company as string | undefined) : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="company"
                    value={f.values.company}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    placeholder="Acme GmbH"
                    state={invalid ? "error" : "default"}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    disabled={disabled}
                  />
                )}
              </FormField>

              <FormField
                label="Location"
                required
                error={f.touched.location ? (f.errors.location as string | undefined) : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="location"
                    value={f.values.location}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    placeholder="Berlin / Remote"
                    state={invalid ? "error" : "default"}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    disabled={disabled}
                  />
                )}
              </FormField>

              <FormField
                label="URL"
                required
                hint="You can paste without https://"
                error={f.touched.url ? (f.errors.url as string | undefined) : undefined}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="url"
                    value={f.values.url}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    placeholder="company.com/job"
                    state={invalid ? "error" : "default"}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    disabled={disabled}
                  />
                )}
              </FormField>

              <FormField label="Status">
                {({ id, describedBy }) => (
                  <select
                    id={id}
                    name="status"
                    value={f.values.status}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    aria-describedby={describedBy}
                    disabled={disabled}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>

              <FormField label="Source">
                {({ id, describedBy }) => (
                  <select
                    id={id}
                    name="source"
                    value={f.values.source}
                    onChange={f.handleChange}
                    onBlur={f.handleBlur}
                    aria-describedby={describedBy}
                    disabled={disabled}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                  >
                    {SOURCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>
            </div>

            <FormField
              label="Notes"
              required
              error={f.touched.notes ? (f.errors.notes as string | undefined) : undefined}
            >
              {({ id, describedBy, invalid }) => (
                <Textarea
                  id={id}
                  name="notes"
                  value={f.values.notes}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                  placeholder="Any details: recruiter, next step, etc."
                  state={invalid ? "error" : "default"}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  disabled={disabled}
                />
              )}
            </FormField>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!canSubmit} variant="default" shadow="sm" shape="lg">
                {disabled ? "Saving..." : submitLabel}
              </Button>

              {onCancel ? (
                <Button
                  type="button"
                  variant="outline"
                  shape="lg"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              ) : null}
            </div>

            {!f.dirty ? (
              <div className="text-xs text-muted-foreground">No changes to save.</div>
            ) : null}
          </form>
        );
      }}
    </Formik>
  );
}
