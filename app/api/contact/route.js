import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, email, message, company, phone, captchaToken } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify reCAPTCHA
        if (!captchaToken) {
            return NextResponse.json({ error: 'reCAPTCHA token missing' }, { status: 400 })
        }

        const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`, {
            method: 'POST'
        })
        const recaptchaData = await recaptchaRes.json()

        if (!recaptchaData.success && process.env.NODE_ENV === 'production') {
            console.error('❌ reCAPTCHA verification failed:', recaptchaData['error-codes'])
            return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
        }

        if (!process.env.RECAPTCHA_SECRET_KEY && process.env.NODE_ENV === 'production') {
            console.error('❌ RECAPTCHA_SECRET_KEY is missing.')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // Configure SMTP transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        // Send email
        const mailOptions = {
            from: process.env.SMTP_FROM || '"DigitFellas Contact" <no-reply@digitfellas.com>',
            to: process.env.CONTACT_EMAIL || 'info@digitfellas.com',
            subject: `New Inquiry from ${name} (${company || 'No Company'})`,
            text: `
New Inquiry Received

Name: ${name}
Company: ${company || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}

Message:
${message}
      `,
            html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1a1a1a; background-color: #f9f9f9; color: #333;">
    <h2 style="color: #0c053e;">New Inquiry Received</h2>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Company:</strong> ${company || 'N/A'}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #0c053e;">
        ${message.replace(/\n/g, '<br>')}
    </div>
</div>
      `,
        }

        // If credentials are not set, return error (important for production)
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('❌ SMTP credentials missing in environment.')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true, message: 'Message sent successfully' })

    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json({ error: 'Failed to send message: ' + error.message }, { status: 500 })
    }
}
