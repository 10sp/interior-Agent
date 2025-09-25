// TelegramService.js
const TELEGRAM_BOT_TOKEN = "7918152804:AAEfqKOSPdTW26F1OpWBhn3onVP3pk-6Jgs";
const TELEGRAM_CHAT_ID = "-4856358827";

function escapeMarkdown(text) {
  if (!text) return "N/A";
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, (match) => `\\${match}`);
}

async function sendTelegramMessage(token, chatId, message) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
        disable_notification: true,
      }),
    }
  );
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description);
  }
  return data;
}

async function sendWaitlistToTelegram(name, email, interest) {
  const currentDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const message = [
    `*NestQuest Waitlist Signup*`,
    `*Name:* ${escapeMarkdown(name)}`,
    `*Email:* ${escapeMarkdown(email)}`,
    `*Interest:* ${escapeMarkdown(interest)}`,
    `*Date and Time:* ${escapeMarkdown(currentDateTime)}`,
  ].join("\n");

  try {
    const data = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
    console.log("Telegram waitlist message sent:", data);
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return false;
  }
}

export { sendWaitlistToTelegram };