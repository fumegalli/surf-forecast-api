import mongoose, { Model, Document } from 'mongoose';

export enum CustomValidation {
  DUPLICATED = 'DUPLICATED',
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CustomValidation.DUPLICATED
);

export const User: Model<UserModel> = mongoose.model('User', schema);
