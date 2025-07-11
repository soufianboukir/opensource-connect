import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  project?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });


const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
export default Conversation;
