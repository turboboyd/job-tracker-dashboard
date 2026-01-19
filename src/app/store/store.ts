import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "src/shared/api/baseApi";
import { uiReducer } from "src/shared/model/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware)
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
