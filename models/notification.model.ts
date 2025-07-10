import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
    user: Types.ObjectId;
    fromUser?: Types.ObjectId;
    type: 'system' | 'project application' | 'propose collaboration' | 'project app rejected' | 'collaboration rejected' | 'project app accepted' | 'collaboration accepted';
    message: string;
    read: boolean;
    link?: string;
    createdAt: Date;
}


const notificationSchema = new Schema<INotification>({
    user:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromUser:     { type: Schema.Types.ObjectId, ref: 'User' },
    message:  { type: String, required: true },
    type:  { type: String, required: true, default: 'system' },
    read:     { type: Boolean, default: false },
    link:     { type: String },
    createdAt:{ type: Date, default: Date.now },
});


const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;