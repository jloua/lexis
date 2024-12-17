"use client";

import { where } from "firebase/firestore";
import { useGetCollection } from "./useGetCollection";
import { useEffect, useState } from "react";
import {
  addDocument,
  newCollectionsCol,
  newSearchItemsCol,
} from "../services/firebase/db";
import { SearchItemType } from "../types/searches";
import { FirebaseError } from "firebase/app";

export const useAddSearch = (userId?: string) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const {
    userDocId,
    collectionData,
    loading: collectionLoading,
    error: collectionError,
  } = useGetCollection(userId || "", [where("title", "==", "All searches")]);

  const handleAddSearch = async (newSearchData: SearchItemType) => {
    if (!userId) {
      setError("User must be logged in to add a search.");
      return;
    }

    setAddingLoading(true);
    setError(null);

    try {
      if (!userDocId) {
        throw new Error("User document ID not available.");
      }

      if (selectedDocId) {
        const colRef = newSearchItemsCol(userDocId, selectedDocId);
        await addDocument(colRef, newSearchData);
      } else {
        const colRef = newCollectionsCol(userDocId);
        const newDocRef = await addDocument(colRef, { title: "All searches" });
        const subColRef = newSearchItemsCol(userDocId, newDocRef.id);
        await addDocument(subColRef, newSearchData);
      }
    } catch (error) {
      if (error instanceof (Error || FirebaseError)) {
        setError(error.message);
      }
      setError("Error adding Document to All searches Col");
    }
    setAddingLoading(false);
  };

  useEffect(() => {
    if (collectionLoading) setLoading(true);
    if (collectionError) setError(collectionError);
  }, [collectionLoading, collectionError]);

  useEffect(() => {
    if (collectionData && collectionData.docs.length) {
      setSelectedDocId(collectionData.docs[0].id);
    }
  }, [collectionData]);

  return {
    handleAddSearch,
    addingLoading,
    error,
    loading,
  };
};
