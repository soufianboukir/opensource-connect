import nodemailer from 'nodemailer'

interface EmailParams {
  type: 'project application' | 'propose collaboration'
  fromName: string
  toEmail: string
  projectTitle?: string
}

export async function sendApplicationEmail({
    type,
    fromName,
    toEmail,
    projectTitle,
    }: EmailParams) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject =
        type === 'project application'
        ? `📩 New Application for "${projectTitle}"`
        : `🤝 New Collaboration Proposal from ${fromName}`

    const text =
        type === 'project application'
        ? `${fromName} has applied to join your project "${projectTitle}".\n\nVisit your dashboard to review the application.`
        : `${fromName} has sent you a proposal for collaboration.\n\nVisit your dashboard to review it.`

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject,
        text,
    })

}
