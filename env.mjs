import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    MONGO_URI: z.string().regex(/^mongodb\+srv:\/\/.*$/), // Must start with mongodb+srv://
    SENDGRID_API: z.string().regex(/^SG\./), // Must start with SG.
    SENDGRID_FROM_EMAIL: z.string().email(),
    SENDGRID_REPLY_TO_EMAIL: z.string().email(),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(39).max(39),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().regex(/^.{1}:/), // Must have a colon after the first character
    NEXT_PUBLIC_FIREBASE_SENDER_ID: z.string().regex(/^[0-9]{12}$/), // Must be a string with numbers 12 char long
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
});
