import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IApplication extends Document {
    applicant: Types.ObjectId;
    toUser: Types.ObjectId;
    project?: Types.ObjectId;
    type: 'project application' | 'propose collaboration';
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        project: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
        type: { type: String, enum: ['project application' , 'propose collaboration'], default: 'propose collaboration' },
        message: { type: String },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    },
    { timestamps: true }
);


const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);
export default Application;

