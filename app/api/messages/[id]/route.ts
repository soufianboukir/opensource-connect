import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Message from '@/models/message.model'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const messageId = params.id

    await dbConnection()

    const message = await Message.findById(messageId)

    if (!message) {
        return NextResponse.json({ message: 'Message not found' }, { status: 404 })
    }

    if (message.sender.toString() !== userId) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    await Message.findByIdAndDelete(messageId)

    return NextResponse.json({ message: 'Message deleted successfully' })
    } catch (err) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
