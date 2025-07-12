import nodemailer from 'nodemailer'

interface EmailParams {
  type: 'project application' | 'propose collaboration'
  fromName: string
  toEmail: string
  projectTitle?: string
}

interface RegistrationEmailParams {
    toEmail: string
    name: string
  }

export async function sendApplicationEmail({
    type,
    fromName,
    toEmail,
    projectTitle,
    }: EmailParams) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject =
        type === 'project application'
        ? `New Application for "${projectTitle}"`
        : `New Collaboration Proposal from ${fromName}`

    const html =
        type === 'project application'
          ? `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="background-color: #3b82f6; padding: 20px;">
                  <h2 style="color: #fff; margin: 0; font-size: 24px;">New Project Application</h2>
                </div>
                <div style="padding: 20px;">
                  <p style="font-size: 16px;">${fromName} has submitted an application to join your project titled "<strong>${projectTitle}</strong>".</p>
                  <p style="font-size: 16px;">This could be a valuable addition to your team. Take a moment to review the applicant's profile, skills, and motivation.</p>
                  <p style="font-size: 16px;">You can view and manage this application by visiting your dashboard:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/apps" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
                      View Applications
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #6b7280;">Thank you,<br/>Opensource Connect Team.</p>
                </div>
              </div>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="background-color: #3b82f6; padding: 20px;">
                  <h2 style="color: #fff; margin: 0; font-size: 24px;">New Collaboration Proposal</h2>
                </div>
                <div style="padding: 20px;">
                  <p style="font-size: 16px;">${fromName} has sent you a collaboration proposal, expressing interest in working together on future or current projects.</p>
                  <p style="font-size: 16px;">Collaboration requests can help expand your project's reach and bring in new talent or ideas.</p>
                  <p style="font-size: 16px;">To view the full proposal and respond, please visit your dashboard:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/apps" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
                      View Proposals
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #6b7280;">Thank you,<br/>Opensource-connect Team.</p>
                </div>
              </div>
            </div>
          `
      
      
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject,
        html
    })
}


export async function sendRegistrationEmail({
    toEmail,
    name,
    }: RegistrationEmailParams) {
    const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    const subject = `Welcome to Opensource Connect, ${name}!`

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="background-color: #3b82f6; padding: 20px;">
                <h2 style="margin: 0; color: white; font-size: 24px;">Welcome to Opensource-connect!</h2>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>

                <p style="font-size: 16px;">
                Thank you for registering with <strong>Opensource-connect</strong>! We're excited to have you onboard.
                Your account is now set up and you're ready to explore, join projects, or collaborate with other developers.
                </p>

                <p style="font-size: 16px;">
                To get started, click the button below to explore projects:
                </p>

                <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/discovery" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Explore Projects
                </a>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                If you have any questions, feel free to contact our support team.
                </p>

                <p style="font-size: 16px; margin-top: 30px;">
                Best regards,<br/>
                The Opensource-connect Team
                </p>
            </div>
            </div>
        </div>
        `


    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: toEmail,
        subject,
        html
    })
}
