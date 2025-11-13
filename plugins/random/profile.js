const handler = async (m, sock, { reply }) => {
  try {
    const userJid = m.sender;
    const userNumber = userJid.split("@")[0];

    let ppUrl;
    try {
      ppUrl = await sock.profilePictureUrl(userJid, "image");
    } catch {
      ppUrl = "https://qu.ax/yyTAH.jpg"; 
    }

    const contact = await sock.onWhatsApp(userJid);
    const pushName = m.pushName || (contact?.notify || "Unknown");

    await sock.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: `*—About You 🌛*
      
- 👤 *Name:* ${pushName}
- 📞 *Number:* wa.me/${userNumber}
- 🤖 *Status:* ${isOwner ? "owner" : isSewa ? "premium user" : "free user"}

_~Keep living even if you're not useful ∆_∆` 
    }, { quoted: m });
  } catch (err) {
    console.error("Error profile:", err);
    await m.reply("An error occurred while fetching your profile.");
  }
};

handler.command = ["profile","pp"];
module.exports = handler;
