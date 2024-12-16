"use client";

import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../services/firebase/config";

export const useGetUserDoc = (userId: string) => {
  const [userData, loading, error] = useCollection(
    query(collection(db, "users"), where("_id", "==", userId))
  );

  return { userData, loading, error };
};
