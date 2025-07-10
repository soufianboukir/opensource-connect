import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Application from '@/models/application.model'
import Project from '@/models/project.model'
import User from '@/models/user.model'
import Notification from '@/models/notification.model'
import { NextRequest, NextResponse } from 'next/server'
import { sendApplicationEmail } from '@/lib/mail'

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

        let projectDoc = null;

        if (type === 'project application') {
            projectDoc = await Project.findById(project);
            if (!projectDoc || String(projectDoc.owner) !== toUser) {
                return NextResponse.json({ message: 'Invalid project or owner mismatch' }, { status: 400 });
            }
        }

        const existing = await Application.findOne({
            applicant: session.user.id,
            toUser,
            type,
            ...(project && { project }),
        })

        if (existing) {
            return NextResponse.json({ message: 'You already sent an application for this' }, { status: 409 })
        }

        const application = await Application.create({
            applicant: session.user.id,
            toUser,
            project: project || undefined,
            type,
            message,
        })

        await Notification.create({
            user: toUser,
            fromUser: session.user.id,
            type: type === 'project application' ? 'project application' : 'propose collaboration',
            message: type === 'project application'
                ? `📩 ${session.user.name} applied to your project.`
                : `🤝 ${session.user.name} sent you a collaboration request.`,
            link: `/applications`,
            read: false,
        })

        await sendApplicationEmail({type, fromName:session.user.name,toEmail:recipient.email,projectTitle:projectDoc?.title})

        return NextResponse.json({ message: 'Application submitted', application })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
