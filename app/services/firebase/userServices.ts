import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "./config";

export const signInWithGoogle = () => signInWithPopup(auth, googleAuthProvider);
