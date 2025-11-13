const fs = require("fs");
const path = require("path");

const loadPlugins = async (dir = path.join(__dirname, "../plugins")) => {
  const plugins = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Folder '${dir}' tidak ditemukan.`);
    return plugins;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Rekursif: baca subfolder juga
      const subPlugins = await loadPlugins(filePath);
      plugins.push(...subPlugins);
    } else if (filePath.endsWith(".js")) {
      try {
        const resolvedPath = require.resolve(filePath);
        if (require.cache[resolvedPath]) delete require.cache[resolvedPath];

        const plugin = require(filePath);

        if (typeof plugin === "function" && Array.isArray(plugin.command)) {
          plugins.push(plugin);
        } else {
          console.warn(`Plugin '${file}' tidak valid (harus function + .command).`);
        }
      } catch (err) {
        console.error(`Gagal memuat plugin di ${filePath}:`, err);
      }
    }
  }

  return plugins;
};

const handleMessage = async (m, sock, commandText, Obj) => {
  const plugins = await loadPlugins();

  for (const plugin of plugins) {
    if (plugin.command.map(c => c.toLowerCase()).includes(commandText.toLowerCase())) {
      try {
        await plugin(m, sock, Obj);
      } catch (err) {
        console.error(`Error saat menjalankan plugin '${commandText}':`, err);
      }
      break;
    }
  }
};

module.exports = handleMessage;