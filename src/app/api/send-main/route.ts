import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/utils/telegram';

const resend = new Resend(process.env.RESEND_API_KEY);
const recipientEmail = process.env.RECIPIENT_EMAIL;

if (!recipientEmail) {
  throw new Error('RECIPIENT_EMAIL environment variable is not set');
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phoneNumber, body } = await request.json();

    // Send email
    const data = await resend.emails.send({
      from: 'Contact Form <noreply@streetbarbell.com>',
      to: [recipientEmail as string],
      subject: 'New Request from streetbarbell.com',
      html: `
        <h2>New Request from streetbarbell.com</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong> ${body}</p>
      `,
    });

    // Send to Telegram bot (non-blocking - don't fail if Telegram fails)
    sendTelegramMessage({
      firstName,
      lastName,
      email,
      phoneNumber,
      body,
    }).catch((error) => {
      console.error('Failed to send Telegram message:', error);
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
} 