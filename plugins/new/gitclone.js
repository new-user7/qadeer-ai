const axios = require("axios");

const handler = async (m, sock, { text, args, reply, command, prefix }) => {
  if (!args[0]) {
    const usage = `
❌ *GitHub link missing!*
📌 Example: ${prefix}${command} https://github.com/Qadeer-Xtech/ICONIC-MD
`;
    return reply(usage);
  }
  
  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) return reply("⚠️ *Invalid GitHub link!*");

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);
    if (!match) throw new Error("Invalid GitHub URL.");

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // Axios 'HEAD' request to get headers
    const response = await axios.head(zipUrl);
    if (response.status !== 200) throw new Error("Repository not found.");

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

    const stylishCaption = `
*╭─❖ɢɪᴛʜᴜʙ ʀᴇᴘᴏ ᴅᴏᴡɴʟᴏᴀᴅ❖─╮*
*│ 📦 ʀᴇᴘᴏ:* ${username}/${repo}
*│ 🗂 ғɪʟᴇ:* ${fileName}
*│ 🔗 ʟɪɴᴋ:* ${args[0]}
*╰─────────❖─────────╯*
  *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽* `;
    await reply(stylishCaption);

    await sock.sendMessage(m.chat, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Repository download failed. Please try again.");
  }
};

handler.command = ['gitclone', 'git'];
handler.tags = ['downloader'];
handler.desc = "Download GitHub repository as a zip file.";
module.exports = handler;
