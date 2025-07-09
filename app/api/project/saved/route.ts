
import { auth } from "@/auth"
import { dbConnection } from "@/config/db"
import Project from "@/models/project.model"
import SavedProject from "@/models/savedProject.model"
import User from "@/models/user.model"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnection()

        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const saved = await SavedProject.find({ user: user._id }).select("project")

        const projectIds = saved.map((entry) => entry.project)

        const projects = await Project.find({ _id: { $in: projectIds } })
                                    .populate("owner", "username name avatarUrl")
                                    .sort({ createdAt: -1 })

        return NextResponse.json({ projects })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
