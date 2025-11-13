const axios = require("axios");

const handler = async (m, sock, { isOwner, text, subCmd, reply, example, totalFitur, fakeMsg, getPluginStats }) => {
  try {
    // Thumbnail image URL
    const botIconUrl = "https://files.catbox.moe/t02bca.jpg";

    // Step 1: Load small thumbnail buffer
    const thumbBuffer = (await axios.get(botIconUrl, { responseType: "arraybuffer" })).data;

    // Step 2: Send small thumbnail wait message
    const waitCaption = `ᴡᴀɪᴛ ғᴏʀ 𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃...`;

    await sock.sendMessage(
      m.chat,
      {
        text: waitCaption,
        contextInfo: {
          externalAdReply: {
            title: "𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃",
            body: "⚡ Qadeer_Khan",
            thumbnail: thumbBuffer,
            sourceUrl: "https://github.com/Qadeer-Xtech/ICONIC-MD",
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false,
          },
        },
      },
      { quoted: m }
    );

    // Step 3: 2-second delay
    await new Promise((r) => setTimeout(r, 2000));

    // Step 4: Stylish ICONIC menu design
    let teks = `
┌─⭓ *𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃 𝐌𝐄𝐍𝐔* ⭓
│
│ 👋 ʜɪ @${m.sender.split("@")[0]}!
│
│⭔ *Bot Name:* ${global.namaBot}
│⭔ *Developer:* ${global.namaOwner}
│⭔ *Version:* ${global.versiBot}
│⭔ *Type:* MD Plugins (CJS)
│
├─⭓ *📜 COMMAND CATEGORIES* ⭓

╭❮👑 OWNER MENU 👑❯✦
┃»➤  .addplugin
┃»➤  .delplugin
┃»➤  .listplugin
┃»➤  .getplugin
┃»➤  .getcase
┃»➤  .bot-off
┃»➤  .bot-on
╰─────────────✦

╭❮📘 INFO MENU 📘❯✦
┃»➤  .ping
┃»➤  .owner
┃»➤  .totalfitur
┃»➤  .thnxto
┃»➤  .bot
╰─────────────✦

╭❮⚙️ MAIN MENU ⚙️❯✦
┃»➤  .sticker
┃»➤  .tourl
╰─────────────✦

└⭓ ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽
`;

    // Step 5: Send the final menu
    await sock.sendMessage(
      m.chat,
      {
        image: { url: botIconUrl },
        caption: teks,
        mentions: [m.sender],
      },
      { quoted: fakeMsg }
    );
  } catch (err) {
    console.error("❌ Menu Error:", err.message);
  }
};

handler.command = ["menu"];
module.exports = handler;