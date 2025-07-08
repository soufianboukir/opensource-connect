import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnection } from "@/config/db";
import Project from "@/models/project.model";
import User from "@/models/user.model";



export async function GET() {
    await dbConnection();

    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email }).select("_id");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const projects = await Project.find({ owner: user._id })
                                    .sort({ createdAt: -1 })
                                    .lean();

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch projects", details: error },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    await dbConnection();
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const {
            title,
            description,
            githubUrl,
            websiteUrl,
            status,
            techStackNeeded,
            rolesNeeded,
            tags,
        } = await req.json();
                

        if (!title || !Array.isArray(techStackNeeded) || !description) {
            return NextResponse.json(
                { error: "Missing or invalid required fields" },
                { status: 400 }
            );
        }
    
        const newProject = await Project.create({
            title,
            description: description,
            githubUrl: githubUrl || "",
            websiteUrl: websiteUrl || "",
            status: status || "active",
            techStackNeeded,
            rolesNeeded,
            tags: tags || [],
            owner: session.user.id,
        });
    
        return NextResponse.json(newProject);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create project", details: error },
            { status: 500 }
        );
    }
}
