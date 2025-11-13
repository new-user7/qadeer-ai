const fs = require("fs");

const handler = async (m, sock, { args, reply }) => {
  try {
    const imageUrl = "https://files.catbox.moe/t02bca.jpg"; // UPTIME PIC

    // --- Uptime Logic (from ping.js) ---
    const uptime = global.runtime(process.uptime());

    // --- Bot Status Logic (User Request) ---
    // Reads setbot.json
    const set = JSON.parse(fs.readFileSync('./data/setbot.json'));
    // true = Public, false = Private
    const modeText = set.botActive ? "Public" : "Private";

    // --- Caption ---
    const text = `┌─⭓ *ICONIC-MD* ⭓
│
│⭔ *User*: ${m.pushName || "Unknown"}
│⭔ *Mode*: ${modeText}
│⭔ *Uptime*: ${uptime}
└─⭓`;

    // --- Sending Image + Caption ---
    await sock.sendMessage(
      m.chat,
      {
        image: { url: imageUrl },
        caption: text,
      },
      { quoted: m }
    );
    
  } catch (err) {
    console.error("❌ Uptime Error:", err);
    await reply("❌ An error occurred.");
  }
};

handler.command = ["uptime"];
module.exports = handler;
