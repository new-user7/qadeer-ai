// zaroori modules ko import karein
const { videoToWebp } = require("../../control/webp.js"); // Aapki webp.js file
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const fs = require("fs");

const handler = async (m, sock, { reply }) => {
  try {
    if (!m.quoted) return reply('*Reply to a video or GIF to convert it to a sticker!*');

    const mime = m.quoted.mtype;
    if (mime !== 'videoMessage' && mime !== 'imageMessage') {
      return reply('*Please reply to a valid video or GIF.*');
    }
    
    // Media download karein (aapke structure ke mutabiq)
    const media = await m.quoted.download();

    // videoToWebp (aapki webp.js file se) istemal karein
    const webpBuffer = await videoToWebp(media);

    // Sticker banayein
    const sticker = new Sticker(webpBuffer, {
      pack: global.namaBot || 'ICONIC-MD',
      author: global.namaOwner || 'Qadeer Khan',
      type: StickerTypes.FULL,
      quality: 75,
    });

    // Sticker bhej dein
    return sock.sendMessage(m.chat, { sticker: await sticker.toBuffer() }, { quoted: m });
    
  } catch (error) {
    console.error(error);
    reply(`❌ An error occurred: ${error.message}`);
  }
};

handler.command = ['vsticker', 'gsticker', 'g2s', 'gs', 'v2s', 'vs'];
handler.tags = ['sticker'];
handler.desc = "Convert GIF/Video to a sticker.";
module.exports = handler;
