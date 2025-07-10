import { NextRequest, NextResponse } from 'next/server'
import { dbConnection } from '@/config/db'
import User from '@/models/user.model'
import Project from '@/models/project.model'

export async function GET(req: NextRequest) {
    try {
        await dbConnection()

        const { searchParams } = new URL(req.url)
        const query = searchParams.get('query')?.trim()

        if (!query) {
            return NextResponse.json({ users: [], projects: [] }, { status: 200 })
        }

        const regex = new RegExp(query, 'i')

        const [users, projects] = await Promise.all([
        User.find({
            $or: [
            { name: regex },
            { username: regex },
            { headLine: regex },
            { techStack: regex },
            ],
        })
            .limit(8)
            .select('name username avatarUrl headLine techStack'),

        Project.find({
            $or: [
            { title: regex },
            { description: regex },
            { tags: regex },
            { techStackNeeded: regex },
            ],
        })
            .limit(8)
            .populate('owner', 'name username avatarUrl')
            .select('title description tags techStackNeeded publicId rolesNeeded status createdAt'),
        ])

        return NextResponse.json({ users, projects }, { status: 200 })
    } catch (err) {
        console.error('[SEARCH_ERROR]', err)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
