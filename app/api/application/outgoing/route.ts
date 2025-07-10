
import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Application from '@/models/application.model'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()

        const applications = await Application.find({ applicant: session.user.id })
                                        .populate('toUser', 'name username avatarUrl headLine openToWork githubUrl')
                                        .populate('project', 'title publicId')
                                        .sort({ createdAt: -1 })

        return NextResponse.json({ applications }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
