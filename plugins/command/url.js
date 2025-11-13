const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { upload } = require("../control/uploader.js"); // Assuming uploader.js is in control folder

const handler = async (m, sock, { args, reply }) => {
  try {
    if (!m.quoted) {
      return reply("⚠️ Reply to an image, video, or audio to convert it to a URL.");
    }

    let type = null;
    if (m.quoted.mtype === "imageMessage") type = "image";
    else if (m.quoted.mtype === "videoMessage") type = "video";
    else if (m.quoted.mtype === "audioMessage") type = "audio";

    if (!type) {
      return reply("⚠️ Reply to an image, video, or audio to convert it to a URL.");
    }

    // Download the media
    let buffer = await m.quoted.download();

    // Upload to catbox.moe using the 'upload' function from uploader.js
    const url = await upload(buffer);

    if (!url) {
        throw new Error("Failed to upload media.");
    }

    await reply(`⚔️ URL generated: ${url}`);
  } catch (e) {
    await reply("❌ URL error: " + e.message);
  }
};

handler.command = ["url"];
module.exports = handler;