import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { dbConnection } from '@/config/db'
import { authOptions } from '@/lib/authOptions'
import Notification from '@/models/notification.model'

export async function PATCH() {
    await dbConnection()

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const result = await Notification.updateMany(
            { user: session.user.id, read: false },
            { $set: { read: true } }
        )

        return NextResponse.json(
            {
                message: 'All notifications marked as read',
                modifiedCount: result.modifiedCount,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}