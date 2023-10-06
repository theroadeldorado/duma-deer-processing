import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { FileT } from '@/lib/types';
import toast from 'react-hot-toast';
import { env } from '@/env.mjs';

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: `${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function uploadFile(file: File): Promise<FileT | null> {
  try {
    const ext = file.name.split('.').pop() || '';
    const id = uuidv4();
    const storage = getStorage();
    const name = `${id}.${ext}`;
    const storageRef = ref(storage, name);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return {
      path: snapshot.ref.fullPath,
      filename: file.name || '',
      ext,
      url,
      size: snapshot.metadata.size,
    };
  } catch (error) {
    toast.error('Error uploading file');
    return null;
  }
}
