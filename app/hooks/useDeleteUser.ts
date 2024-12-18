"use client";

import { useEffect, useState } from "react";
import { useDeleteDoc } from "./useDeleteDoc";
import { useGetUserDoc } from "./useGetUserDoc";
import { usersCol } from "../services/firebase/db";
import { getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { deleteUserFromAuth } from "../services/firebase/userServices";
import { useDeleteSubcollections } from "./useDeleteSubcollections";

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
    deleteSubcollectionAndItems,
    error: subColError,
    loading: subColLoading,
  } = useDeleteSubcollections();

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

    const errors: string[] = [];

    // Delete subcollections and their documents belonging to user
    try {
      await deleteSubcollectionAndItems(userDocId);
    } catch (error) {
      errors.push(
        error instanceof (Error || FirebaseError)
          ? error.message
          : "Failed to delete subcollections and items."
      );
    }

    // Delete user document from db
    try {
      await deleteDocument(userDocId, usersCol);
    } catch (error) {
      errors.push(
        error instanceof (Error || FirebaseError)
          ? error.message
          : "Failed to delete user doc from db."
      );
    }

    // Delete user from auth
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid === userId) {
        await deleteUserFromAuth(currentUser);
      }
    } catch (error) {
      errors.push(
        error instanceof (Error || FirebaseError)
          ? error.message
          : "Error deleting user from auth."
      );
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
    } else {
      setError(null);
    }

    setLoading(false);
  };
  return {
    deleteUserCompletely,
    error: error || docError || userError || subColError,
    loading: loading || docLoading || userLoading || subColLoading,
  };
};
