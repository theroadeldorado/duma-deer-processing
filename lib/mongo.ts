import mongoose from 'mongoose';
import Profile from 'models/Profile';
import Deer from 'models/Deer';
import EmailTemplate from 'models/EmailTemplate';
import { ProfileT, EmailTemplateT, DeerT } from 'lib/types';
import { env } from '@/env.mjs';

declare global {
  var mongoose: any;
}

//https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(env.MONGO_URI || '', opts).then((mongoose) => {
        return mongoose;
      });
    } catch (e) {
      throw new Error('Error connecting to database');
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export const getProfile = async (id: string, fields?: string[]): Promise<ProfileT | null> => {
  await connect();
  const result = await Profile.findOne({ _id: id }, fields).lean();
  return result ? JSON.parse(JSON.stringify(result)) : null;
};

export const getProfiles = async (): Promise<ProfileT[]> => {
  await connect();
  const result = await Profile.find();
  return JSON.parse(JSON.stringify(result));
};

export const getProfileByCode = async (inviteCode: string): Promise<ProfileT | null> => {
  await connect();
  const result = await Profile.findOne({ inviteCode });
  return result ? JSON.parse(JSON.stringify(result)) : null;
};

export const getEmailTemplate = async (id: string): Promise<EmailTemplateT | null> => {
  await connect();
  const result = await EmailTemplate.findById(id);
  return result ? JSON.parse(JSON.stringify(result)) : null;
};

export const getDeer = async (id: string): Promise<DeerT | null> => {
  await connect();
  const result = await Deer.findById(id).lean();
  return result ? JSON.parse(JSON.stringify(result)) : null;
};
