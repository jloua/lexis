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

export const useGetAllSearches = (userId: string): GetSearchItemsResult => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDocId, setuserDocId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const [userData, userLoading, userError] = useCollection(
    query(collection(db, "users"), where("_id", "==", userId))
  );

  const [collectionData, collectionLoading, collectionError] = useCollection(
    query(
      collection(db, `users/${userDocId}/collections`),
      where("title", "==", "All searches")
    )
  );

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
    setLoading(userLoading || collectionLoading || itemsLoading);
  }, [userLoading, collectionLoading, itemsLoading]);

  useEffect(() => {
    if (userError || collectionError || itemsError) {
      setError(
        (userError && userError.message) ||
          (collectionError && collectionError.message) ||
          (itemsError && itemsError.message) ||
          "Unknow error getting all searches"
      );
    }
  }, [userError, collectionError, itemsError]);

  useEffect(() => {
    if (userData && userData.docs.length) {
      setuserDocId(userData.docs[0].id);
    }
  }, [userData]);

  useEffect(() => {
    if (collectionData && collectionData.docs.length) {
      setSelectedDocId(collectionData.docs[0].id);
    }
  }, [collectionData]);

  return { snapshot: itemsData, error, loading };
};
