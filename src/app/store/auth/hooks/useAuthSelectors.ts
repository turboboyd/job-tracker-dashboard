import { selectAuthDisplayName, selectAuthEmail, selectAuthError, selectAuthLoading, selectAuthPhotoURL, selectAuthReady, selectAuthUser, selectIsAuthenticated, selectUid } from "src/app/store/auth/authSelectors";
import { useAppSelector } from "src/app/store/hooks/hooks";

export function useAuthSelectors() {
  return {
    user: useAppSelector(selectAuthUser),
    userId: useAppSelector(selectUid),
    isAuthenticated: useAppSelector(selectIsAuthenticated),
    isAuthReady: useAppSelector(selectAuthReady),

    displayName: useAppSelector(selectAuthDisplayName),
    email: useAppSelector(selectAuthEmail),
    photoURL: useAppSelector(selectAuthPhotoURL),

    isLoading: useAppSelector(selectAuthLoading),
    error: useAppSelector(selectAuthError),
  };
}
