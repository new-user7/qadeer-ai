const axios = require("axios");

const handler = async (m, sock, { text, reply, command, prefix }) => {
  const header = "╔══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚═════════✰═════╝";
  
  // Quoted text ko bhi check karega
  const prompt = text || (m.quoted && m.quoted.text);

  if (!prompt) {
    const usage = `
${header}

❌ Provide a prompt to generate video.
📌 Usage: ${prefix}${command} anime girl with blue hair
(You can also reply to a text)
`;
    return await reply(usage);
  }

  try {
    await reply(`🎬 Generating AI video for: *${prompt}*...`);
    
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(prompt)}`;
    const { data } = await axios.get(apiUrl, { timeout: 60000 });

    const videoUrl = data?.videoUrl || data?.result || data?.data?.videoUrl;
    if (!videoUrl) throw new Error("No videoUrl found in API response");

    await sock.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: `🎥 *AI Video Generated!*\n\n📝 *Prompt:* ${prompt}`
    }, { quoted: m });

  } catch (error) {
    console.error("[SORA CMD ERROR]", error?.message || error);
    reply("❌ Failed to generate video. Try again later.");
  }
};

handler.command = ["sora", "soravideo", "txt2video", "genvid"];
handler.tags = ['ai'];
handler.desc = "Generate AI video from text prompt.";
module.exports = handler;
