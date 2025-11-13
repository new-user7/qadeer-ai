const { Sticker, StickerTypes } = require("wa-sticker-formatter");
// downloadContentFromMessage is not needed, m.quoted.download() will be used

const handler = async (m, sock, { args, reply }) => {
  try {
    if (m.quoted?.mtype !== "stickerMessage") {
      return reply("⚠️ Reply to a sticker to modify it.");
    }

    // Download the sticker using the built-in download function
    let buffer = await m.quoted.download();

    // Re-creation of the sticker with your name
    const sticker = new Sticker(buffer, {
      pack: "╚»★𝐐𝐀𝐃𝐄𝐄𝐑𝐀𝐈★«╝",
      author: m.pushName || "ICONIC-MD",
      type: StickerTypes.FULL,
      quality: 70,
    });

    await sock.sendMessage(m.chat, { sticker: await sticker.build() }, { quoted: m });

  } catch (e) {
    await reply("❌ take error : " + e.message);
  }
};

handler.command = ["take"];
module.exports = handler;