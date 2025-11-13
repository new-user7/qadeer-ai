const axios = require("axios");

const handler = async (m, sock, { text, reply, command, prefix }) => {
  const header = "╔══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚══════════✰═════╝";
  
  if (!text) {
    const usage = `
${header}

❌ Please provide a prompt for the image.
📌 Usage: ${prefix}${command} a beautiful horse
`;
    return await reply(usage);
  }

  try {
    await reply("> *CREATING IMAGINE ...🔥*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(text)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await sock.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽* 🚀\n✨ Prompt: *${text}*`
    }, { quoted: m });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
};

handler.command = ["creat-img", "flux", "imagine"];
handler.tags = ['ai'];
handler.desc = "Generate an image using AI.";
module.exports = handler;
