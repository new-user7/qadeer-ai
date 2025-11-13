// plugins/owner/vv2.js

const handler = async (m, sock, { reply, isOwner }) => {
  try {
    // 1. VARIABLE FIX: 'isCreator' ko 'isOwner' se tabdeel kiya
    // Yeh command ab sirf owner ke liye chalega (silent fail)
    if (!isOwner) {
      return; 
    }

    // 2. VARIABLE FIX: 'match.quoted' ko 'm.quoted' se tabdeel kiya
    if (!m.quoted) {
      return await reply("*🍁 Please reply to a view once message!*");
    }

    // 3. VARIABLE FIX: 'm.quoted.download()' (yeh aapke naye system mein hai)
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

    // 4. FINAL FIX: 'client.sendMessage' ko 'sock.sendMessage'
    // aur 'message.sender' ko 'm.sender' se tabdeel kiya
    
    // Message ko user ke DM mein bhej dein
    await sock.sendMessage(m.sender, messageContent, { quoted: m });
    
    // (Optional) Group mein tasdeeqi paigham bhej dein
    await reply("✅ View-once media aapke DM mein bhej diya hai.");

  } catch (error) {
    console.error("vv2 Error:", error);
    await reply("❌ Error fetching vv message:\n" + error.message);
  }
};

// Aliases (command triggers)
handler.command = ["vv2", "wah", "💋", "❤️", "🙂", "nice", "ok"];
handler.tags = ['owner'];
handler.desc = "Owner Only - retrieve quoted message to DM";
module.exports = handler;
