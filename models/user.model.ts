import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  createdAt: Date;
}


const userSchema = new Schema<IUser>({
    username:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    bio:        { type: String },
    avatarUrl:  { type: String },
    githubUrl:  { type: String },
    techStack:  [{ type: String }],
    createdAt:  { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

