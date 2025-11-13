const axios = require("axios");

const handler = async (m, sock, { text, args, reply, command, prefix }) => {
  const header = "╔══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚═════════✰═════╝";
  
  try {
    const query = text || "random";
    
    await reply(`🌌 Searching wallpaper for: *${query}*...`);
    
    const apiUrl = `https://pikabotzapi.vercel.app/random/randomwall/?apikey=anya-md&query=${encodeURIComponent(query)}`;

    const { data } = await axios.get(apiUrl);
    
    if (data.status && data.imgUrl) {
      const caption = `🌌 *Random Wallpaper: ${query}*\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`;
      await sock.sendMessage(m.chat, { image: { url: data.imgUrl }, caption }, { quoted: m });
    } else {
      reply(`❌ No wallpaper found for *"${query}"*.`);
    }
  } catch (error) {
    console.error("Wallpaper Error:", error);
    reply("❌ An error occurred while fetching the wallpaper. Please try again.");
  }
};

handler.command = ["rw", "randomwall", "wallpaper"];
handler.tags = ['downloader'];
handler.desc = "Download random wallpapers based on keywords.";
module.exports = handler;
