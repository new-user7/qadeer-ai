const fs = require("fs");
const path = require("path");

const handler = async (m, sock, { isOwner, text, command, reply }) => {
  try {
    if (!isOwner) return reply(mess.own); // 'mess.own' is defined in settings.js

    if (!text || !text.endsWith(".js"))
      return reply(`Example: *.${command}* command/menu.js`);

    const baseDir = path.join(__dirname, "../../plugins");
    const targetPath = path.join(baseDir, text.trim());

    if (!fs.existsSync(targetPath))
      return reply(`Plugin *${text}* not found in the plugins folder.`);

    fs.unlinkSync(targetPath);
    return reply(`Successfully deleted plugin *${text.trim()}*`);
  } catch (err) {
    console.error(err);
    reply("An error occurred while deleting the plugin.");
  }
};

handler.command = ["delp", "dp", "delplugin", "delplugins"];
module.exports = handler;
