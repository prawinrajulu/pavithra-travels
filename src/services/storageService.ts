import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface UploadProgressHandler {
  (progress: number): void;
}

export const uploadImageResumable = (
  file: File,
  path: string,
  onProgress?: UploadProgressHandler
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    
    // Set metadata
    const metadata = {
      contentType: file.type,
    };

    console.log(`[DEBUG] Starting resumable upload to: ${path}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`[DEBUG] Upload is ${Math.round(progress)}% done`);
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('[DEBUG] Upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('[DEBUG] Upload successful. URL:', downloadURL);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
