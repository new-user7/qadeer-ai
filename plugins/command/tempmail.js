const axios = require("axios");

const handler = async (m, sock, { args, reply, command, prefix }) => {
  const header = "╔═══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚══════════✰═════╝";

  try {
    const processingText = `
${header}

📧 Generating temporary email...
`;
    await reply(processingText);

    const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');
    const { email, session_id, expires_at } = response.data;

    const expiresDate = new Date(expires_at);
    const timeString = expiresDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const dateString = expiresDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const message = `
${header}

📧 *TEMPORARY EMAIL GENERATED*

✉️ *Email Address:*
${email}

⏳ *Expires:*
${timeString} • ${dateString}

🔑 *Session ID:*
\`\`\`${session_id}\`\`\`

📥 *Check Inbox:*
${prefix}inbox ${session_id}

_Email will expire after 24 hours_
`;

    await reply(message);

  } catch (err) {
    const text = `
${header}

❌ Failed to generate email!
⚠️ ${err.message}
`;
    await reply(text);
  }
};

handler.command = ["tempmail"];
module.exports = handler;
