const fs = require("fs");
const path = require("path");

const handler = async (m, sock, { isOwner, text, command, reply }) => {
  try {
    if (!isOwner) return reply(mess.own); // 'mess.own' is defined in settings.js

    if (!text || !m.quoted || !m.quoted.text)
      return reply(`Example: *.${command}* command/menu.js (by replying to the code)`);

    if (!text.endsWith(".js"))
      return reply(`Example: *.${command}* command/menu.js`);

    const filePath = path.join(__dirname, "../../plugins", text.trim());
    const dirPath = path.dirname(filePath);

    // Create folder if it doesn't exist
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    fs.writeFileSync(filePath, m.quoted.text);

    return reply(`Successfully saved plugin at *${text.trim()}*`);
  } catch (err) {
    console.error(err);
    reply("An error occurred while saving the plugin.");
  }
};

handler.command = ["addp", "addplugin", "addplugins", "saveplugin", "saveplugins", "svp", "sp"];
module.exports = handler;
