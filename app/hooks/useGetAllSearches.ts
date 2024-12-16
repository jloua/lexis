"use client";

import {
  collection,
  CollectionReference,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
import { GetSearchItemsResult, SearchItemType } from "../types/searches";
import { useGetCollection } from "./useGetCollection";

export const useGetAllSearches = (userId: string): GetSearchItemsResult => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const {
    userDocId,
    collectionData,
    loading: collectionLoading,
    error: collectionError,
  } = useGetCollection(userId, where("title", "==", "All searches"));

  const [itemsData, itemsLoading, itemsError] = useCollection<SearchItemType>(
    selectedDocId
      ? query(
          collection(
            db,
            `users/${userDocId}/collections/${selectedDocId}/items`
          ) as CollectionReference<SearchItemType>
        )
      : null
  );

  useEffect(() => {
    setLoading(collectionLoading || itemsLoading);
  }, [collectionLoading, itemsLoading]);

  useEffect(() => {
    if (collectionError || itemsError) {
      setError(
        (collectionError && collectionError) ||
          (itemsError && itemsError.message) ||
          "Unknow error getting all searches"
      );
    }
  }, [collectionError, itemsError]);

  useEffect(() => {
    if (collectionData && collectionData.docs.length) {
      setSelectedDocId(collectionData.docs[0].id);
    }
  }, [collectionData]);

  return { snapshot: itemsData, error, loading };
};
