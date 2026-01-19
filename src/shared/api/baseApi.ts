import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Jobs", "Loops", "LoopRuns", "LoopMatches"],

  keepUnusedDataFor: 60,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: () => ({}),
});
