const axios = require("axios");

const handler = async (m, sock, { args, reply, command, prefix }) => {
  const header = "╔════════════════✰════╗\n       𝐐𝐀𝐃𝐄𝐄𝐑-𝐌𝐃\n╚═══════════════✰═════╝";

  const title = args.join(" ");
  if (!title) {
    const text = `
${header}

❌ No song specified!
📌 Usage: ${prefix}${command} <title or artist>
`;
    return await reply(text);
  }

  try {
    const searchingText = `
${header}

⚡ Searching for: *${title}*...
`;
    await reply(searchingText);

    // Search API
    const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(
      title
    )}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result || !data.result.download_url) {
      throw new Error("No song found or link unavailable.");
    }

    const video = data.result;

    // Sending thumbnail + info
    const caption = `
${header}

🎵 *Song Found* 🎵
⚔️ Title: *${video.title}*
⏱️ Duration: ${video.duration}
👁️ Views: ${video.views}
🔗 Link: ${video.video_url}

📥 Downloading audio...
`;

    await sock.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption,
      },
      { quoted: m }
    );

    // Sending audio
    await sock.sendMessage(
      m.chat,
      {
        audio: { url: video.download_url },
        mimetype: "audio/mp4",
        ptt: false,
      },
      { quoted: m }
    );
  } catch (err) {
    const text = `
${header}

❌ Failed to fetch song!
⚠️ ${err.message}
`;
    await reply(text);
  }
};

handler.command = ["song"];
module.exports = handler;