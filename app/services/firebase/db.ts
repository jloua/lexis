import { FirebaseError } from "firebase/app";
import {
  CollectionReference,
  doc,
  DocumentData,
  setDoc,
} from "firebase/firestore";

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
