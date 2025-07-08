import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import Notification from '@/models/notification.model'
import { auth } from '@/auth'

export async function GET(req: NextRequest) {
    await dbConnection()
    const session = await auth()

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    try {
        const total = await Notification.countDocuments({ user: session.user.id })
        const notifications = await Notification.find({ user: session.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('fromuser', 'name avatarUrl')
                .lean()

        return NextResponse.json({
            notifications,
            page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}