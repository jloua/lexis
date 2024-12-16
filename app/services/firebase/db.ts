import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { UserDocType } from "@/app/types/user";
import { SearchItemType } from "@/app/types/searches";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

const createSubCollection = <T = DocumentData>(
  parentPath: string,
  subCollectionName: string
) => {
  return collection(
    db,
    `${parentPath}/${subCollectionName}`
  ) as CollectionReference<T>;
};

export const usersCol = createCollection<UserDocType>("users");

export const newCollectionsCol = (userDocId: string) =>
  createSubCollection<{ title: string }>(`users/${userDocId}`, "collections");

export const newSearchItemsCol = (userDocId: string, searchColId: string) =>
  createSubCollection<SearchItemType>(
    `users/${userDocId}/collections/${searchColId}`,
    "items"
  );

export const addDocument = async <NewDocumentType>(
  colRef: CollectionReference<NewDocumentType>,
  data: NewDocumentType
) => {
  try {
    return await addDoc<NewDocumentType, DocumentData>(colRef, data);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    } else {
      throw new Error("Error setting a new document in DB");
    }
  }
};
