"use client";

import { FirebaseError } from "firebase/app";
import { CollectionReference, deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";

export const useDeleteDoc = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = async <T>(
    docId: string,
    colRef: CollectionReference<T>
  ) => {
    setLoading(true);
    const docRef = doc(colRef, docId);

    try {
      return await deleteDoc(docRef);
    } catch (error) {
      setError(
        error instanceof (Error || FirebaseError)
          ? error.message
          : `Error deleting document with id ${docId}`
      );
    }
  };

  return {
    deleteDocument,
    error,
    loading,
  };
};
