"use client";

import React, { PropsWithChildren, createContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { AuthType, UserType } from "../types/user";
import { auth } from "../services/firebase/config"
import { deleteTokenInCookie, loginWPassword, logoutFunc, signInWithGoogle, signupWithEmail, updateUserProfileFunc } from "@/app/services/firebase/userServices"

export const AuthContext = createContext<AuthType | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  const signupWEmail = async (email: string, password: string) => {
    await signupWithEmail(email, password);
    await reloadUser();
  };

  const signupWGoogle = async () => {
    await signInWithGoogle();
    await reloadUser();
  };

  const login = async (email: string, password: string) => {
    await loginWPassword(email, password);
    await reloadUser();
  };

  const logout = async () => {
    await logoutFunc();
    await reloadUser();
  };

  const reloadUser = async () => {
    if (!currentUser) {
      return false;
    }

    await currentUser.reload();
    const updatedUser = auth.currentUser;
    setUserName(currentUser.displayName);
    setUserEmail(currentUser.email);
    setUserPhotoUrl(currentUser.photoURL);

    if (updatedUser) {
      setCurrentUser(updatedUser);
    }

    return true;
  };

  const updateUserProfile = async (data: UserType) => {
    if (!currentUser) {
      throw new Error("Unauthorised, you are not logged in");
    }

    await updateUserProfileFunc(currentUser, data);
    await reloadUser();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserPhotoUrl(user.photoURL);
      } else {
        await deleteTokenInCookie();
        setUserEmail(null);
        setUserName(null);
        setUserPhotoUrl(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const authContextValue: AuthType = {
    signupWEmail,
    signupWGoogle,
    login,
    logout,
    reloadUser,
    updateUserProfile,
    currentUser,
    userEmail,
    userName,
    userPhotoUrl,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? (
        <div>
          <span>Loading...</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
