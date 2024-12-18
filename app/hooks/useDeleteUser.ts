"use client";

import { useEffect, useState } from "react";
import { useDeleteDoc } from "./useDeleteDoc";
import { useGetUserDoc } from "./useGetUserDoc";
import { usersCol } from "../services/firebase/db";
import { getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { deleteUserFromAuth } from "../services/firebase/userServices";

export const useDeleteUser = (userId: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDocId, setuserDocId] = useState<string | null>(null);
  const {
    userData,
    loading: userLoading,
    error: userError,
  } = useGetUserDoc(userId);
  const {
    deleteDocument,
    error: docError,
    loading: docLoading,
  } = useDeleteDoc();

  useEffect(() => {
    if (userData && userData.docs.length) {
      setuserDocId(userData.docs[0].id);
    }
  }, [userData]);

  const deleteUserCompletely = async () => {
    if (!userDocId) {
      setError("No user document ID available.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await deleteDocument(userDocId, usersCol);

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid === userId) {
        await deleteUserFromAuth(currentUser);
      }
    } catch (error) {
      setError(
        error instanceof (Error || FirebaseError)
          ? error.message
          : "Error deleting user from auth and db."
      );
    }
    setLoading(false);
  };
  return {
    deleteUserCompletely,
    error: error || docError || userError,
    loading: loading || docLoading || userLoading,
  };
};
