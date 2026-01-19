import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FieldValue,
  type UpdateData,
} from "firebase/firestore";

import type { Loop, LoopMatch } from "src/entities/loop/model";
import { baseApi } from "src/shared/api/baseApi";
import { db } from "src/shared/config/firebase/firebase";

import type {
  CreateLoopInput,
  UpdateLoopInput,
  CreateMatchInput,
  UpdateLoopMatchStatusInput,
  DeleteLoopMatchInput,
} from "./loopApi.types";

// --------------------
// small utils
// --------------------

type ApiError = { message: string };

function toMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function rtkError(message: string) {
  return { error: { message } as ApiError } as const;
}

function trimStr(v: unknown): string {
  return String(v ?? "").trim();
}

function trimArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map(trimStr).filter(Boolean);
}

function normalizeUrl(input: string): string {
  const v = trimStr(input);
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
}

function makeTimestamps(): { iso: string; server: FieldValue } {
  const iso = new Date().toISOString();
  return {
    iso,
    server: serverTimestamp(),
  };
}

function cleanLoopCreate(
  input: CreateLoopInput
): Omit<Loop, "id"> & { createdAtTs: unknown; updatedAtTs: unknown } {
  const { iso, server } = makeTimestamps();

  return {
    userId: input.userId,
    name: trimStr(input.name),

    titles: trimArray(input.titles),
    location: trimStr(input.location),
    radiusKm: Number.isFinite(input.radiusKm) ? input.radiusKm : 30,
    remoteMode: input.remoteMode,
    platforms: input.platforms,

    filters: input.filters ?? undefined,

    createdAt: iso,
    updatedAt: iso,
    createdAtTs: server,
    updatedAtTs: server,
  };
}

function cleanLoopPatch(
  input: UpdateLoopInput
): Partial<Omit<Loop, "id">> & { updatedAtTs: unknown; updatedAt: string } {
  const { iso, server } = makeTimestamps();

  const patch: Partial<Omit<Loop, "id">> & {
    updatedAtTs: unknown;
    updatedAt: string;
  } = {
    updatedAt: iso,
    updatedAtTs: server,
  };

  if (typeof input.name === "string") patch.name = trimStr(input.name);
  if (Array.isArray(input.titles)) patch.titles = trimArray(input.titles);
  if (typeof input.location === "string")
    patch.location = trimStr(input.location);
  if (typeof input.radiusKm === "number" && Number.isFinite(input.radiusKm))
    patch.radiusKm = input.radiusKm;
  if (typeof input.remoteMode === "string") patch.remoteMode = input.remoteMode;
  if (Array.isArray(input.platforms)) patch.platforms = input.platforms;

  // ✅ IMPORTANT: allow clearing filters by passing undefined
  if ("filters" in input) patch.filters = input.filters ?? undefined;

  return patch;
}

function cleanMatchCreate(
  input: CreateMatchInput
): Omit<LoopMatch, "id"> & { createdAtTs: unknown; updatedAtTs: unknown } {
  const { iso, server } = makeTimestamps();

  return {
    userId: input.userId,
    loopId: input.loopId,

    title: trimStr(input.title),
    company: trimStr(input.company),
    location: trimStr(input.location),

    platform: input.platform,
    url: normalizeUrl(input.url),
    description: trimStr(input.description),

    status: input.status,
    matchedAt: input.matchedAt,

    createdAt: iso,
    updatedAt: iso,
    createdAtTs: server,
    updatedAtTs: server,
  };
}

// --------------------
// api
// --------------------

export const loopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoops: builder.query<Loop[], { userId: string }>({
      async queryFn({ userId }) {
        try {
          const q = query(
            collection(db, "loops"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );

          const snap = await getDocs(q);
          const loops: Loop[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Loop, "id">),
          }));
          return { data: loops };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      providesTags: (res) =>
        res
          ? [
              ...res.map((l) => ({ type: "Loops" as const, id: l.id })),
              { type: "Loops" as const, id: "LIST" },
            ]
          : [{ type: "Loops" as const, id: "LIST" }],
    }),

    getLoop: builder.query<Loop | null, { loopId: string }>({
      async queryFn({ loopId }) {
        try {
          const snap = await getDoc(doc(db, "loops", loopId));
          if (!snap.exists()) return { data: null };
          return {
            data: { id: snap.id, ...(snap.data() as Omit<Loop, "id">) },
          };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      providesTags: (_res, _err, arg) => [
        { type: "Loops" as const, id: arg.loopId },
      ],
    }),

    createLoop: builder.mutation<{ id: string }, CreateLoopInput>({
      async queryFn(input) {
        try {
          const payload = cleanLoopCreate(input);
          const ref = await addDoc(collection(db, "loops"), payload);
          return { data: { id: ref.id } };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      invalidatesTags: [{ type: "Loops", id: "LIST" }],
    }),

    updateLoop: builder.mutation<void, UpdateLoopInput>({
      async queryFn(input) {
        try {
          const patch = cleanLoopPatch(input);
          await updateDoc(
            doc(db, "loops", input.loopId),
            patch as UpdateData<Omit<Loop, "id">>
          );

          return { data: undefined };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      invalidatesTags: (_r, _e, a) => [
        { type: "Loops", id: a.loopId },
        { type: "Loops", id: "LIST" },
      ],
    }),

    getLoopMatches: builder.query<
      LoopMatch[],
      { userId: string; loopId: string }
    >({
      async queryFn({ userId, loopId }) {
        try {
          const q = query(
            collection(db, "loopMatches"),
            where("userId", "==", userId),
            where("loopId", "==", loopId),
            orderBy("matchedAt", "desc")
          );

          const snap = await getDocs(q);
          const matches: LoopMatch[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<LoopMatch, "id">),
          }));
          return { data: matches };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      providesTags: (res, _err, arg) =>
        res
          ? [
              ...res.map((m) => ({ type: "LoopMatches" as const, id: m.id })),
              { type: "LoopMatches" as const, id: `LIST:${arg.loopId}` },
            ]
          : [{ type: "LoopMatches" as const, id: `LIST:${arg.loopId}` }],
    }),

    createLoopMatch: builder.mutation<{ id: string }, CreateMatchInput>({
      async queryFn(input) {
        try {
          const payload = cleanMatchCreate(input);
          const ref = await addDoc(collection(db, "loopMatches"), payload);
          return { data: { id: ref.id } };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      invalidatesTags: (_res, _err, arg) => [
        { type: "LoopMatches", id: `LIST:${arg.loopId}` },
      ],
    }),

    updateLoopMatchStatus: builder.mutation<void, UpdateLoopMatchStatusInput>({
      async queryFn({ matchId, status }) {
        try {
          const { iso, server } = makeTimestamps();
          await updateDoc(doc(db, "loopMatches", matchId), {
            status,
            updatedAt: iso,
            updatedAtTs: server,
          } as UpdateData<Omit<LoopMatch, "id">>);

          return { data: undefined };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },

      // ✅ Optimistic update: UI changes immediately
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          loopApi.util.updateQueryData(
            "getLoopMatches",
            { userId: arg.userId, loopId: arg.loopId },
            (draft) => {
              const m = draft.find((x) => x.id === arg.matchId);
              if (m) m.status = arg.status;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      invalidatesTags: (_r, _e, a) => [{ type: "LoopMatches", id: a.matchId }],
    }),

    deleteLoopMatch: builder.mutation<void, DeleteLoopMatchInput>({
      async queryFn({ matchId }) {
        try {
          await deleteDoc(doc(db, "loopMatches", matchId));
          return { data: undefined };
        } catch (e) {
          return rtkError(toMsg(e));
        }
      },
      invalidatesTags: (_r, _e, a) => [
        { type: "LoopMatches", id: `LIST:${a.loopId}` },
      ],
    }),
  }),
});

export const {
  useGetLoopsQuery,
  useGetLoopQuery,
  useCreateLoopMutation,
  useUpdateLoopMutation,
  useGetLoopMatchesQuery,
  useCreateLoopMatchMutation,
  useUpdateLoopMatchStatusMutation,
  useDeleteLoopMatchMutation,
} = loopApi;
