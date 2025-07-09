import { Schema, model, Types, Document } from 'mongoose';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  seenBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default model<IMessage>('Message', messageSchema);
