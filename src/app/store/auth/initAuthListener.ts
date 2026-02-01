import type { Unsubscribe, User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "src/shared/config/firebase/firebase";

import type { AppDispatch } from "../store";

import { setAuthReady, setUser } from "./authSlice";
import type { AuthUser } from "./authTypes";

const mapFirebaseUser = (u: User): AuthUser => ({
  uid: u.uid,
  email: u.email,
  displayName: u.displayName,
  photoURL: u.photoURL,
});

let unsubscribe: Unsubscribe | null = null;

export const initAuthListener = () => (dispatch: AppDispatch) => {
  if (unsubscribe) return;

  unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    dispatch(setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null));
    dispatch(setAuthReady(true));
  });
};

export const stopAuthListener = () => (_dispatch: AppDispatch) => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};
