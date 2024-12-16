import { FirebaseError } from "firebase/app";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { UserDocType } from "@/app/types/user";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const usersCol = createCollection<UserDocType>("users");

export const addDocument = async <NewDocumentType>(
  colRef: CollectionReference<NewDocumentType>,
  data: NewDocumentType
) => {
  const docRef = doc(colRef);
  try {
    return await setDoc<NewDocumentType, DocumentData>(docRef, data);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("Error setting a new document in DB");
    }
  }
};
