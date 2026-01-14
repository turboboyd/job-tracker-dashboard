import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type FieldValue,
  type UpdateData,
} from "firebase/firestore";

import { baseApi } from "src/shared/api/baseApi";
import { db } from "src/shared/config/firebase/firebase";

import type { Job, JobSource, JobStatus } from "../model/types";

export type CreateJobInput = {
  userId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: JobStatus;
  source: JobSource;
  notes: string;
};

type FirestoreApiError = {
  status: "FIRESTORE_ERROR";
  data: { message: string };
};

function toFirestoreError(e: unknown): FirestoreApiError {
  const message = e instanceof Error ? e.message : String(e);
  return { status: "FIRESTORE_ERROR", data: { message } };
}

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], { userId: string }>({
      async queryFn({ userId }) {
        try {
          const q = query(
            collection(db, "jobs"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );

          const snap = await getDocs(q);

          const jobs: Job[] = snap.docs.map((d) => {
            const data = d.data() as Omit<Job, "id">;
            return { id: d.id, ...data };
          });

          return { data: jobs };
        } catch (e) {
          return { error: toFirestoreError(e) };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((j) => ({ type: "Jobs" as const, id: j.id })),
              { type: "Jobs" as const, id: "LIST" },
            ]
          : [{ type: "Jobs" as const, id: "LIST" }],
    }),

    createJob: builder.mutation<{ id: string }, CreateJobInput>({
      async queryFn(input) {
        try {
          const nowIso = new Date().toISOString();

          const payload: Omit<Job, "id"> & {
            createdAtTs: FieldValue;
            updatedAtTs: FieldValue;
          } = {
            userId: input.userId,
            title: input.title.trim(),
            company: input.company.trim(),
            location: input.location.trim(),
            url: normalizeUrl(input.url),
            status: input.status,
            source: input.source,
            notes: input.notes.trim(),
            appliedAt: null,
            createdAt: nowIso,
            updatedAt: nowIso,
            createdAtTs: serverTimestamp(),
            updatedAtTs: serverTimestamp(),
          };

          const ref = await addDoc(collection(db, "jobs"), payload);
          return { data: { id: ref.id } };
        } catch (e) {
          return { error: toFirestoreError(e) };
        }
      },
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),

    updateJob: builder.mutation<
      void,
      { jobId: string; patch: Partial<Omit<Job, "id" | "userId">> }
    >({
      async queryFn({ jobId, patch }) {
        try {
          const nowIso = new Date().toISOString();

          const safePatch: UpdateData<DocumentData> = {
            ...patch,
            updatedAt: nowIso,
            updatedAtTs: serverTimestamp(),
          };

          if (typeof patch.url === "string") {
            safePatch.url = normalizeUrl(patch.url);
          }

          await updateDoc(doc(db, "jobs", jobId), safePatch);
          return { data: undefined };
        } catch (e) {
          return { error: toFirestoreError(e) };
        }
      },
      invalidatesTags: (_res, _err, arg) => [{ type: "Jobs", id: arg.jobId }],
    }),

    deleteJob: builder.mutation<void, { jobId: string }>({
      async queryFn({ jobId }) {
        try {
          await deleteDoc(doc(db, "jobs", jobId));
          return { data: undefined };
        } catch (e) {
          return { error: toFirestoreError(e) };
        }
      },
      invalidatesTags: [{ type: "Jobs", id: "LIST" }],
    }),

    updateJobStatus: builder.mutation<void, { jobId: string; status: JobStatus }>(
      {
        async queryFn({ jobId, status }) {
          try {
            const nowIso = new Date().toISOString();

            const patch: UpdateData<DocumentData> = {
              status,
              updatedAt: nowIso,
              updatedAtTs: serverTimestamp(),
            };

            await updateDoc(doc(db, "jobs", jobId), patch);
            return { data: undefined };
          } catch (e) {
            return { error: toFirestoreError(e) };
          }
        },
        invalidatesTags: (_res, _err, arg) => [{ type: "Jobs", id: arg.jobId }],
      }
    ),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useUpdateJobStatusMutation,
} = jobApi;
