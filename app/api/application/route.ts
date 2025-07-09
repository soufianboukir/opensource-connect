import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Application from '@/models/application.model'
import Project from '@/models/project.model'
import User from '@/models/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()
        const { toUser, project, type, message } = await req.json()

        if (!toUser || !type) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        if (!['project application', 'propose collaboration'].includes(type)) {
            return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
        }

        if (type === 'project application' && !project) {
            return NextResponse.json({ message: 'Project ID is required for project applications' }, { status: 400 })
        }

        const recipient = await User.findById(toUser)
        if (!recipient) {
            return NextResponse.json({ message: 'Recipient user not found' }, { status: 404 })
        }

        if (type === 'project application') {
            const projectExists = await Project.findById(project)
            if (!projectExists || String(projectExists.owner) !== toUser) {
                return NextResponse.json({ message: 'Invalid project or owner mismatch' }, { status: 400 })
            }
        }

        const application = await Application.create({
            applicant: session.user.id,
            toUser,
            project: project || undefined,
            type,
            message,
        })

        return NextResponse.json({ message: 'Application submitted', application }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
