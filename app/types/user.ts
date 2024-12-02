import { User, UserCredential } from "firebase/auth";

export type AuthType = {
  signupWEmail: (email: string, password: string) => Promise<UserCredential>;
  signupWGoogle: () => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  reloadUser: () => boolean;
  setEmail: (email: string) => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  setPhotoUrl: (url: string) => Promise<void>;
  currentUser: User | null;
  userEmail: string | null;
  userName: string | null;
  userPhotoUrl: string | null;
};
