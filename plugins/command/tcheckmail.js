
const axios = require("axios");

const handler = async (m, sock, { args, reply, command, prefix }) => {
  const header = "╔═══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚══════════✰═════╝";

  const sessionId = args[0];
  if (!sessionId) {
    const text = `
${header}

❌ No Session ID provided!
📌 Usage: ${prefix}${command} <session_id>
`;
    return await reply(text);
  }

  try {
    const checkingText = `
${header}

📬 Checking inbox for: *${sessionId}*...
`;
    await reply(checkingText);

    const inboxUrl = `https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${encodeURIComponent(sessionId)}`;
    const response = await axios.get(inboxUrl);

    if (!response.data.success) {
      throw new Error("Invalid session ID or expired email");
    }

    const { inbox_count, messages } = response.data;

    if (inbox_count === 0) {
      const text = `
${header}

📭 Your inbox is empty.
`;
      return await reply(text);
    }

    let messageList = `
${header}

📬 *You have ${inbox_count} message(s)*\n\n`;
    
    messages.forEach((msg, index) => {
        messageList += `━━━━━━━━━━━━━━━━━━\n` +
                      `📌 *Message ${index + 1}*\n` +
                      `👤 *From:* ${msg.from}\n` +
                      `📝 *Subject:* ${msg.subject}\n` +
                      `⏰ *Date:* ${new Date(msg.date).toLocaleString()}\n\n` +
                      `📄 *Content:*\n${msg.body}\n\n`;
    });

    await reply(messageList);

  } catch (err) {
    const text = `
${header}

❌ Error checking inbox!
⚠️ ${err.message}
`;
    await reply(text);
  }
};

handler.command = ["checkmail", "inbox", "tmail", "mailinbox"];
module.exports = handler;