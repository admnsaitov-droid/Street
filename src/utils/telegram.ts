/**
 * @fileoverview Utility function to send messages to Telegram bot
 * 
 * This utility sends formatted messages to a Telegram bot using the Telegram Bot API.
 * It formats contact form submissions into readable messages.
 * 
 * @example
 * await sendTelegramMessage({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phoneNumber: '+1234567890',
 *   message: 'Hello, I have a question...'
 * });
 */

interface TelegramMessageData {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  subject?: string;
  body: string;
  message?: string;
  timezone?: string;
  languages?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Formats contact form data into a readable Telegram message
 */
function formatTelegramMessage(data: TelegramMessageData): string {
  const name = data.name || data.fullName ||
    (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.firstName || 'N/A');
  const message = data.body || data.message || 'N/A';
  const subject = data.subject ? `\n📋 <b>Theme:</b> ${data.subject}` : '';
  const location = data.timezone ? `\n🌍 <b>Location:</b> ${data.timezone}` : '';
  const languages = data.languages ? `\n🗣 <b>System Languages:</b> ${data.languages}` : '';

  const utmParts = [
    data.utm_source ? `source: ${data.utm_source}` : '',
    data.utm_medium ? `medium: ${data.utm_medium}` : '',
    data.utm_campaign ? `campaign: ${data.utm_campaign}` : '',
    data.utm_term ? `term: ${data.utm_term}` : '',
    data.utm_content ? `content: ${data.utm_content}` : '',
  ].filter(Boolean);
  const utm = utmParts.length > 0 ? `\n📊 <b>UTM:</b> ${utmParts.join(' | ')}` : '';

  return `🔔 <b>New Request from streetbarbell.com</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${data.email}
📱 <b>Phone:</b> ${data.phoneNumber}${subject}
💬 <b>Message:</b>
${message}${location}${languages}${utm}`;
}

/**
 * Sends a message to Telegram bot
 * @param data Contact form data to send
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function sendTelegramMessage(data: TelegramMessageData): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If Telegram is not configured, silently skip (don't fail the request)
  if (!botToken || !chatId) {
    console.warn('Telegram bot not configured: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing');
    return false;
  }

  try {
    const message = formatTelegramMessage(data);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Telegram API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

