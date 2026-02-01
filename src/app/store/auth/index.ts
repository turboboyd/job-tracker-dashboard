export { authReducer } from "./authSlice";

export { setUser, setAuthReady, clearAuthError } from "./authSlice";
export { useAuthActions, useAuthSelectors } from "./hooks";

export {
  selectAuth,
  selectUid,
  selectIsAuthenticated,
  selectAuthReady,
  selectAuthDisplayName,
  selectAuthEmail,
  selectAuthPhotoURL,
  selectAuthLoading,
  selectAuthError,
  selectAuthErrorCode,
} from "./authSelectors";

export type { AuthUser, AuthState, AuthError } from "./authTypes";

export { initAuthListener, stopAuthListener } from "./initAuthListener";

export {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutThunk,
} from "./authThunks";
