"use client";

import React, { PropsWithChildren, createContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthType, UpdateProfileFormFieldsType } from "../types/user";
import { auth } from "../services/firebase/config"
import { logoutFunc, signInWithGoogle, signupWithEmail, updateUserProfileFunc } from "@/app/services/firebase/userServices"

export const AuthContext = createContext<AuthType | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  const signupWEmail = (email: string, password: string) => {
    return signupWithEmail(email, password);
  }

  const signupWGoogle = () => {
    return signInWithGoogle();
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logout = () => {
    return logoutFunc();
  };

  const reloadUser = () => {
    if (!currentUser) {
      return false;
    }

    setUserName(currentUser.displayName);
    setUserEmail(currentUser.email);
    setUserPhotoUrl(currentUser.photoURL);

    return true;
  };

  const updateUserProfile = (data: UpdateProfileFormFieldsType) => {
    if (!currentUser) {
      throw new Error("Unauthorised, you are not logged in");
    }

    return updateUserProfileFunc(currentUser, data);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserPhotoUrl(user.photoURL);
      } else {
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
