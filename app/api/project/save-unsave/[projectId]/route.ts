
import { auth } from "@/auth";
import { dbConnection } from "@/config/db";
import SavedProject from "@/models/savedProject.model";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

interface Params {
    params: {
        projectId: string;
    };
}

export async function POST(req: Request, { params }: Params) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userEmail = session.user.email;
        const projectId = params.projectId;

        if (!projectId) {
            return NextResponse.json({ message: "Project ID is required" }, { status: 400 });
        }

        await dbConnection();

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const savedEntry = await SavedProject.findOne({ user: user._id, project: projectId });

        if (savedEntry) {
            await SavedProject.deleteOne({ _id: savedEntry._id });
            return NextResponse.json({ message: "Project unsaved", saved: false });
        } else {
            await SavedProject.create({ user: user._id, project: projectId });
            return NextResponse.json({ message: "Project saved", saved: true });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
