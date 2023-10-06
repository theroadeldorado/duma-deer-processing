import 'server-only';
import firebase from 'firebase-admin';
import { env } from '@/env.mjs';

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      project_id: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key: env.FIREBASE_PRIVATE_KEY,
      client_email: env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: `${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export const admin = firebase;
export const auth = firebase.auth();
