const handler = async (m, sock, { reply, isOwner }) => {
  try {
    if (!isOwner) {
      return await reply("*📛 This is an owner command.*");
    }

    if (!m.quoted) {
      return await reply("*🍁 Please reply to a view once message!*");
    }

    // Media download karein (aapke m.quoted.download se)
    const buffer = await m.quoted.download();
    const mtype = m.quoted.mtype;

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: m.quoted.text || '',
          mimetype: m.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: m.quoted.text || '',
          mimetype: m.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: m.quoted.ptt || false
        };
        break;
      default:
        return await reply("❌ Only image, video, and audio messages are supported");
    }

    // Usi chat mein wapas bhej dein
    await sock.sendMessage(m.chat, messageContent, { quoted: m });
    
  } catch (error) {
    console.error("vv Error:", error);
    await reply("❌ Error fetching vv message:\n" + error.message);
  }
};

handler.command = ["vv", "viewonce", "retrive"];
handler.tags = ['owner'];
handler.desc = "Owner Only - retrieve quoted message back";
module.exports = handler;
