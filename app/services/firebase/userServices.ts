import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleAuthProvider } from "./config";
import axios from "axios";

const setTokenInCookie = async (token: string) => {
  try {
    await axios.post("/api/auth/setCookie", { token });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error setting cookie");
    }
  }
};

const deleteTokenInCookie = async () => {
  try {
    await axios.post("/api/auth/deleteCookie");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting cookie");
    }
  }
};

export const signupWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const token = await userCredential.user.getIdToken();

  try {
    await setTokenInCookie(token);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  return userCredential;
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleAuthProvider);
  const token = await userCredential.user.getIdToken();

  try {
    await setTokenInCookie(token);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  return userCredential;
};

export const logoutFunc = async () => {
  await deleteTokenInCookie();
  return signOut(auth);
};
