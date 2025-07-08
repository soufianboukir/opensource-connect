import mongoose, { Schema, Types, Document } from "mongoose";

export interface IProject extends Document {
    title: string;
    description: string;
    owner: Types.ObjectId; 
    techStackNeeded: string[];
    rolesNeeded: { role: string; count: number }[];
    githubUrl?: string;
    websiteUrl?: string;
    status: "active" | "archived" | "in progress";
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true},
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        techStackNeeded: { type: [String], default: [], required: true },
        rolesNeeded: {
            type: [
                {
                    role: { type: String, required: true },
                    count: { type: Number, required: true, min: 1 },
                },
            ],
                default: [],
        },
        githubUrl: { type: String, default: "" },
        websiteUrl: { type: String, default: "" },
        status: {
            type: String,
            enum: ["active", "archived", "in progress"],
            default: "active",
        },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
