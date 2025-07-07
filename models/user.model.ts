import mongoose, { Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  bio?: string;
  headLine: string;
  openToWork: boolean;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead',
  avatarUrl?: string;
  githubUrl?: string;
  techStack?: string[];
  createdAt: Date;
}


const userSchema = new Schema<IUser>({
    name: {type: String, required: false},
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    headLine: { type: String },
    openToWork: { type: Boolean},
    experienceLevel: { type: String, enum: ['junior','mid','senior','lead']},
    bio:        { type: String },
    avatarUrl:  { type: String },
    githubUrl:  { type: String },
    techStack:  [{ type: String }],
    createdAt:  { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

