const fs = require("fs");
const path = require("path");

const handler = async (m, sock, { isOwner, reply }) => {
  try {
    if (!isOwner) return reply(mess.own); // 'mess.own' is defined in settings.js

    const baseDir = path.join(__dirname, "../../plugins");
    if (!fs.existsSync(baseDir)) return reply("Folder ./plugins not found.");

    // get all categories (folders)
    const categories = fs.readdirSync(baseDir).filter((f) => {
      const fullPath = path.join(baseDir, f);
      return fs.statSync(fullPath).isDirectory();
    });

    let totalFiles = 0;
    let teks = "";

    for (const category of categories) {
      const catPath = path.join(baseDir, category);
      const files = fs.readdirSync(catPath).filter((f) => f.endsWith(".js"));
      totalFiles += files.length;

      teks += `\n*${category.charAt(0).toUpperCase() + category.slice(1)}*\n`;
      for (const file of files) {
        teks += ` └ ./plugins/${category}/${file}\n`;
      }
    }

    const header = `*Plugins Manager ⭐*\n> *plugin files:* ${totalFiles}\n> *total folders:* ${categories.length}\n`;
    return reply(header + teks);
  } catch (err) {
    console.error(err);
    reply("An error occurred while reading the plugin list.");
  }
};

handler.command = ["listplugin", "listp", "listplugins"];
module.exports = handler;
