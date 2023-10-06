import { ProfileT, ProfileSchemaT } from 'lib/types';
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
import { RoleType } from 'lib/enums';

const fields: ProfileSchemaT = {
  uid: {
    type: String, //Firebase UID
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: RoleType.USER,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  inviteCode: String,
};

const ProfileSchema = new Schema(fields, {
  timestamps: true,
});

const Profile = models?.Profile || model('Profile', ProfileSchema);

export default Profile as mongoose.Model<ProfileT>;
