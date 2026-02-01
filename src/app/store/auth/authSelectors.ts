import type { RootState } from "../rootReducer";

export const selectAuth = (state: RootState) => state.auth;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectUid = (state: RootState) => state.auth.user?.uid ?? null;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.user?.uid);

export const selectAuthReady = (state: RootState) => state.auth.isAuthReady;

export const selectAuthDisplayName = (state: RootState) =>
  state.auth.user?.displayName ?? "";

export const selectAuthEmail = (state: RootState) =>
  state.auth.user?.email ?? "";

export const selectAuthPhotoURL = (state: RootState) =>
  state.auth.user?.photoURL ?? null;

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthError = (state: RootState) =>
  state.auth.error?.message ?? null;

export const selectAuthErrorCode = (state: RootState) =>
  state.auth.error?.code ?? null;
