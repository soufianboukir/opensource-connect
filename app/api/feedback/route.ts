import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    try {
        const { type, rating, message } = await req.json()

        if (!message?.trim()) {
            return NextResponse.json({ message: 'Message is required' }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    })

        const mailOptions = {
            from: `"Feedback Bot" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: `New Feedback Received: ${type}`,
            text: `You received a new feedback.\n\nType: ${type}\nRating: ${rating}/5\n\nMessage:\n${message}`,
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ message: 'Feedback sent successfully' })
    } catch (err) {
        console.error('[FEEDBACK_EMAIL_ERROR]', err)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
