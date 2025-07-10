import { auth } from "@/auth"
import { dbConnection } from "@/config/db"
import User from "@/models/user.model"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnection()
        const currentUser = await User.findById(session.user.id)

        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        let suggestedUsers = []

        if (currentUser.techStack && currentUser.techStack.length > 0) {
            suggestedUsers = await User.find({
                _id: { $ne: currentUser._id },
                techStack: { $in: currentUser.techStack },
            })
            .limit(5)
            .sort({ createdAt: -1 })
            .select("name username avatarUrl headLine")
        }

        if (suggestedUsers.length === 0) {
            suggestedUsers = await User.find({
                _id: { $ne: currentUser._id },
            })
            .limit(5)
            .sort({ createdAt: 1 })
            .select("name username avatarUrl headLine")
        }

        return NextResponse.json({ suggestedUsers })
    } catch {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
