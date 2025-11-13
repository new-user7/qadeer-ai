const fs = require("fs");
const path = require("path");

const handler = async (m, sock, { isOwner, text, command, reply, totalFitur, totalPlugin, isBan }) => {
  try {
    if (isBan) return await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    if (!isOwner) return reply(mess.own); // 'mess.own' is defined in settings.js (already translated)

    const baseDir = path.join(__dirname, "../../plugins");

    if (!text.endsWith(".js")) return reply(`Example: *.${command}* command/menu.js\n\nType: *.listplugin* to see plugin files`);

    const targetPath = path.join(baseDir, text.trim());
    if (!fs.existsSync(targetPath)) return reply("Plugin not found.");

    const fileContent = fs.readFileSync(targetPath, "utf8");
    return reply(fileContent);
  } catch (err) {
    console.error(err);
    return reply("An error occurred while reading the plugin.");
  }
};

handler.command = ["getp", "gp", "getplugin", "getplugins"];
module.exports = handler;
