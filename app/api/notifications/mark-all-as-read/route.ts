import { NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import Notification from '@/models/notification.model'
import { auth } from '@/auth'

export async function PATCH() {
    await dbConnection()

    const session = await auth()
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