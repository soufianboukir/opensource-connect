import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Conversation from '@/models/conversation.model'
import Message from '@/models/message.model'

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        await dbConnection()

        const conversations = await Conversation.find({
                participants: userId,
                })
                .populate({
                    path: 'lastMessage',
                    model: Message,
                    select: 'seen sender',
                })

        const unseenCount = conversations.filter((conv) => {
        const last = conv.lastMessage
            return last && !last.seen && last.sender.toString() !== userId
        }).length

        return NextResponse.json({ unseenConversations: unseenCount })
    } catch (err) {
        console.error('[GET_UNSEEN_CONVERSATIONS]', err)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
