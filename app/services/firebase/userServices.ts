import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, googleAuthProvider } from "./config";
import axios from "axios";
import { UserType } from "@/app/types/user";
import { addDocument, usersCol } from "./db";
import { getDocs, query, where } from "firebase/firestore";

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

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return new Error(error.message);
  }
  return new Error("Error in userServices");
};

export const signupWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { user } = userCredential;

    await addDocument(usersCol, {
      _id: user.uid,
    });

    const token = await user.getIdToken();
    await setTokenInCookie(token);
  } catch (error) {
    const err = handleError(error);
    throw new Error(err.message, err);
  }
};

export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleAuthProvider);

    const token = await userCredential.user.getIdToken();

    const { user } = userCredential;

    const snapshot = await getDocs(
      query(usersCol, where("_id", "==", user.uid))
    );

    if (snapshot.empty) {
      await addDocument(usersCol, {
        _id: user.uid,
      });
    }

    await setTokenInCookie(token);
  } catch (error) {
    const err = handleError(error);
    throw new Error(err.message, err);
  }
};

export const loginWPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();

    await setTokenInCookie(token);
  } catch (error) {
    const err = handleError(error);
    throw new Error(err.message, err);
  }
};

export const logoutFunc = async () => {
  await deleteTokenInCookie();
  return signOut(auth);
};

export const updateUserProfileFunc = async (
  currentUser: User,
  data: UserType
) => {
  const { email, displayName, photoUrl } = data;

  try {
    if (email && email !== currentUser.email) {
      await updateEmail(currentUser, email);
    }

    if (displayName && displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName });
    }

    if (photoUrl && photoUrl !== currentUser.photoURL) {
      await updateProfile(currentUser, { photoURL: photoUrl });
    }
  } catch (error) {
    const err = handleError(error);
    throw new Error(err.message, err);
  }
};
