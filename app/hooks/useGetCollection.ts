"use client";

import { collection, query, QueryConstraint } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../services/firebase/config";
import { useEffect, useState } from "react";
import { useGetUserDoc } from "./useGetUserDoc";

export const useGetCollection = (
  userId: string,
  queryConstraint: QueryConstraint
) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDocId, setuserDocId] = useState<string | null>(null);
  const {
    userData,
    loading: userLoading,
    error: userError,
  } = useGetUserDoc(userId);

  const [collectionData, collectionLoading, collectionError] = useCollection(
    query(collection(db, `users/${userDocId}/collections`), queryConstraint)
  );

  useEffect(() => {
    if (userData && userData.docs.length) {
      setuserDocId(userData.docs[0].id);
    }
  }, [userData]);

  useEffect(() => {
    setLoading(userLoading || collectionLoading);
  }, [userLoading, collectionLoading]);

  useEffect(() => {
    if (userError || collectionError) {
      setError(
        (userError && userError.message) ||
          (collectionError && collectionError.message) ||
          "Unknow error getting all searches"
      );
    }
  }, [userError, collectionError]);

  return {
    userDocId,
    collectionData,
    error,
    loading,
  };
};
