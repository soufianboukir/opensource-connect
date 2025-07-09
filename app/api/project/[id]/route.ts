import { auth } from "@/auth";
import { dbConnection } from "@/config/db";
import Project from "@/models/project.model";
import { NextResponse } from "next/server";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnection();
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const id = params.id;
        const updates = await req.json();

        if (!updates.title || !Array.isArray(updates.techStackNeeded) || !updates.description) {
            return NextResponse.json(
                { error: "Missing or invalid required fields" },
                { status: 400 }
            );
        }

        const existing = await Project.findById(id);

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (existing.owner.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true });

        return NextResponse.json({updatedProject});
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project", details: error }, { status: 500 });
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnection();
    const session = await auth();
  
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
        const id = params.id;
    
        const existing = await Project.findById(id);
    
        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
    
        if (existing.owner.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    
        await Project.findByIdAndDelete(id);
    
        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project", details: error }, { status: 500 });
    }
}
