import { signInWithPopup } from "firebase/auth";
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
