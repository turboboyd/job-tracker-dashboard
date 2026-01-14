import { JobFormValues, JobSource, JobStatus } from "./types";

export type JobPatch = {
  title: string;
  company: string;
  location: string;
  url: string;
  status: JobStatus;
  source: JobSource;
  notes: string;
};

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function jobFormToPatch(values: JobFormValues): JobPatch {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    location: values.location.trim(),
    url: normalizeUrl(values.url),
    status: values.status,
    source: values.source,
    notes: values.notes.trim(),
  };
}
