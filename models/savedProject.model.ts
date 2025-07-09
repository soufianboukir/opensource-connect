import mongoose, { Schema, Types, Document } from "mongoose";

export interface ISavedProject extends Document {
  user: Types.ObjectId;
  project: Types.ObjectId;
  savedAt: Date;
}

const savedProjectSchema = new Schema<ISavedProject>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    savedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

savedProjectSchema.index({ user: 1, project: 1 }, { unique: true });


const SavedProject = mongoose.models.SavedProject || mongoose.model<ISavedProject>('SavedProject', savedProjectSchema);
export default SavedProject;

