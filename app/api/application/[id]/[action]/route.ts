import { auth } from '@/auth'
import { dbConnection } from '@/config/db'
import Application from '@/models/application.model'
import Notification from '@/models/notification.model';
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string; action: string } }) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id, action } = params

        await dbConnection()
        const application = await Application.findById(id).populate('project')

        if (!application) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 })
        }

        const userId = session.user.id
        const isOwner = String(application.toUser) === userId

        switch (action) {
            case 'accept': {
                if (!isOwner)
                    return NextResponse.json({ message: 'Only the recipient can accept the application' }, { status: 403 })
                
                application.status = 'accepted'
                await application.save()
                
                const typeLabel = application.type === 'project application' ? 'application' : 'collaboration request'
                const projectTitle = application.project?.title
                
                await Notification.create({
                    user: application.applicant,
                    fromUser: application.toUser,
                    type: application.type === 'project application' ? 
                        'project app accepted'
                    : 'collaboration accepted',
                    message: application.type === 'project application'
                    ? `Success! your application${projectTitle ? ` for "${projectTitle}"` : ''} has been accepted.`
                    : `Success! your collaboration request has been accepted.`,
                    link: '/apps',
                    read: false,
                })
                
                return NextResponse.json({ message: `The ${typeLabel} has been accepted.`, application })
                }
              
            case 'reject': {
                if (!isOwner)
                return NextResponse.json({ message: 'Only the recipient can reject the application' }, { status: 403 })
            
                application.status = 'rejected'
                await application.save()
            
                const typeLabel = application.type === 'project application' ? 'application' : 'collaboration request'
                const projectTitle = application.project?.title
            
                await Notification.create({
                    user: application.applicant,
                    fromUser: application.toUser,
                    type: application.type === 'project application' ? 
                        'project app rejected'
                    : 'collaboration rejected',
                    message: application.type === 'project application'
                        ? `Sorry! your application${projectTitle ? ` for "${projectTitle}"` : ''} has been rejected.`
                        : `Sorry! your collaboration request has been rejected.`,
                    link: '/apps',
                    read: false,
                })
            
                return NextResponse.json({ message: `The ${typeLabel} has been rejected.`, application })
            }
              

            case 'cancel':
                await application.deleteOne()
                return NextResponse.json({ message: 'Application cancelled' })

            default:
                return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
        }
    } catch (err) {
        console.error('[APPLICATION_ACTION]', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
