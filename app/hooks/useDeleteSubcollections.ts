"use client";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase/config";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

export const useDeleteSubcollections = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const deleteCollection = async (
    parentPath: string,
    subcollectionName: string
  ) => {
    const subColRef = collection(doc(db, parentPath), subcollectionName);
    const subColDocs = await getDocs(subColRef);

    const errors: string[] = [];
    setLoading(true);

    const deletePromises = subColDocs.docs.map(async (doc) => {
      try {
        await deleteDoc(doc.ref);
      } catch (error) {
        errors.push(
          error instanceof (Error || FirebaseError)
            ? error.message
            : "Failed to delete collection and its documents."
        );
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }

    setLoading(false);

    await Promise.all(deletePromises);
  };

  const deleteSubcollectionAndItems = async (userDocId: string) => {
    const collectionsPath = `users/${userDocId}/collections`;
    const collectionsRef = collection(db, collectionsPath);
    const collectionsDocs = await getDocs(collectionsRef);

    const errors: string[] = [];
    setLoading(true);

    const deletePromises = collectionsDocs.docs.map(async (collectionDoc) => {
      const itemsPath = `${collectionsPath}/${collectionDoc.id}`;

      try {
        await deleteCollection(itemsPath, "items");
        await deleteDoc(collectionDoc.ref);
      } catch (error) {
        errors.push(
          error instanceof (Error || FirebaseError)
            ? error.message
            : "Failed to delete subcollection and its documents."
        );
      }

      if (errors.length > 0) {
        setError(errors.join("\n"));
      } else {
        setError(null);
      }

      setLoading(false);
    });

    await Promise.all(deletePromises);
  };

  return {
    deleteSubcollectionAndItems,
    error,
    loading,
  };
};
