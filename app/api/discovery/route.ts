import { dbConnection } from '@/config/db'
import Project from '@/models/project.model'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        await dbConnection()
        const { searchParams } = new URL(req.url)

        const status = searchParams.get('status')
        const techStack = searchParams.getAll('techStack')
        const roles = searchParams.getAll('roles')
        const tags = searchParams.getAll('tags')
        const sort = searchParams.get('sort') || 'newest'
        const page = parseInt(searchParams.get('page') || '1', 10)

        const limit = 10
        const skip = (page - 1) * limit

        const query: any = {}

        if (status) query.status = status

        if (techStack.length > 0) {
            query.techStackNeeded = { $all: techStack }
        }

        if (roles.length > 0) {
            query['rolesNeeded.role'] = {
                $in: roles.map(role => new RegExp(`^${role}$`, 'i'))
            }
        }

        if (tags.length > 0) {
            query.tags = {
                $all: tags.map(tag => new RegExp(`^${tag}$`, 'i'))
            }
        }

        const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

        const [projects, total] = await Promise.all([
            Project.find(query)
                .populate('owner', 'username name avatarUrl headLine')
                .sort(sortOption)
                .skip(skip)
                .limit(limit),
            Project.countDocuments(query)
        ])

        return NextResponse.json({
            projects,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
