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
    const { fullName, email, phoneNumber, subject, body, timezone, languages, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = await request.json();

    // Send email
    const data = await resend.emails.send({
      from: 'Contact Form <noreply@streetbarbell.com>',
      to: [recipientEmail as string],
      subject: 'New Request from streetbarbell.com',
      html: `
        <h2>New Request from streetbarbell.com</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Theme:</strong> ${subject}</p>
        <p><strong>Question:</strong> ${body}</p>
      `,
    });

    // Send to Telegram bot (non-blocking - don't fail if Telegram fails)
    sendTelegramMessage({
      fullName,
      email,
      phoneNumber,
      subject,
      body,
      timezone,
      languages,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    }).catch((error) => {
      console.error('Failed to send Telegram message:', error);
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
} 