import type { Timestamp } from "firebase/firestore";

export type JobStatus = "saved" | "applied" | "interview" | "rejected";
export type JobSource = "linkedin" | "indeed" | "company" | "other";

export type Job = {
  id: string;
  userId: string;

  title: string;
  company: string;
  location?: string;
  type?: "full-time" | "part-time" | "internship" | "apprenticeship" | "contract";
  status: JobStatus;
  source?: JobSource;

  url?: string;
  notes?: string;

  createdAt: string; 
  updatedAt: string;   
  appliedAt?: string | null; 
};

export type JobFormValues = {
  title: string;
  company: string;
  location: string;
  url: string;
  status: JobStatus;
  source: JobSource;
  notes: string;
};

export type JobDoc = Omit<Job, "id" | "createdAt" | "updatedAt" | "appliedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  appliedAt?: Timestamp | null;
};
