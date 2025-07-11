import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Conversation from '@/models/conversation.model'
import Message from '@/models/message.model'
import User from '@/models/user.model'
import { Types } from 'mongoose'
import Project from '@/models/project.model'

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
                        .sort({ updatedAt: -1 })
                        .populate({
                            path: 'participants',
                            select: 'name username avatarUrl',
                        })
                        .populate({
                            path: 'project',
                            model: Project,
                            select: 'publicId'
                        })
                        .populate({
                            path: 'lastMessage',
                            model: Message,
                            populate: {
                                path: 'sender',
                                model: User,
                                select: 'name username avatarUrl',
                            },
                        })
                        .exec()

        return NextResponse.json({ conversations })
    } catch (err) {
        console.error('[GET_CONVERSATIONS]', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { recipientId, message, projectId } = await req.json()
        const currentUserId = session.user.id

        if (!recipientId || !message) {
            return NextResponse.json(
                { message: 'Recipient and message are required' },
                { status: 400 }
            )
        }

        await dbConnection()

        let conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, recipientId], $size: 2 },
        ...(projectId ? { project: new Types.ObjectId(projectId) } : {}),
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, recipientId],
                project: projectId ? new Types.ObjectId(projectId) : undefined,
            })
        }

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: currentUserId,
            text: message,
            seen: false,
        })

        conversation.lastMessage = newMessage._id
        await conversation.save()

        return NextResponse.json(
            { message: 'Conversation started', conversationId: conversation._id },
            { status: 200 }
        )
    } catch (error) {
        console.error('[START_CONVERSATION]', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
