
import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Application from '@/models/application.model'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await dbConnection()

        const { message } = await req.json()
        const { id } = params

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ message: 'Invalid or missing message' }, { status: 400 })
        }

        const application = await Application.findById(id)

        if (!application) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 })
        }

        if (String(application.applicant) !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden: not the applicant' }, { status: 403 })
        }

        application.message = message
        await application.save()

        return NextResponse.json({ message: 'Application updated', application })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
