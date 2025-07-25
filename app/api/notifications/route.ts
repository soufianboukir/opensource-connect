import { NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import Notification from '@/models/notification.model'
import { auth } from '@/auth'

export async function GET() {
    await dbConnection()

    const session = await auth()
    
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const notifications = await Notification.find({ user: session.user.id })
            .sort({ createdAt: -1 })
            .populate('fromUser')
            .lean()
            .limit(5)

        return NextResponse.json({ notifications }, { status: 200 })
  } catch (error){
    console.log(error);
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}