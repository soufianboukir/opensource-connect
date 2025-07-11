import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import Message from '@/models/message.model'
import { auth } from '@/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { conversationId } = params
        await dbConnection()

        const messages = await Message.find({ conversation: conversationId })
                            .sort({ createdAt: 1 })
                            .populate({
                                path: 'sender',
                                select: 'name username avatarUrl',
                            })

        return NextResponse.json({ messages }, { status: 200 })
    } catch (error) {
        console.error('[GET_MESSAGES]', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
