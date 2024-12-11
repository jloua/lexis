import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./config";
import { User } from "firebase/auth";

export const addFile = async (photoFile: FileList, currentUser: User) => {
  const photo = photoFile[0];
  const fileRef = ref(storage, "profilePics/" + currentUser.uid + photo.name);

  return new Promise<string>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, photo);

    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        try {
          const photoUrl = await getDownloadURL(fileRef);
          resolve(photoUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
