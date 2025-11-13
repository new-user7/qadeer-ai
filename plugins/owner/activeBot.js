const fs = require("fs");
const path = "./data/setbot.json";

const handler = async (m, sock, { isOwner, command }) => {
  const data = JSON.parse(fs.readFileSync(path));

  switch (command) {
    case "bot-on":
      if (!isOwner) return m.reply(mess.owner); // 'mess.owner' is defined in settings.js
      if (data.botActive) return m.reply("Bot is already online");
      data.botActive = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return m.reply("[BOT - ON] • *All users can use the bot!*")

    case "bot-off":
      if (!isOwner) return m.reply(mess.owner); // 'mess.owner' is defined in settings.js
      if (!data.botActive) return m.reply("Bot is already offline!");
      data.botActive = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return m.reply("[BOT OFF] • *Bot is offline, only owner can access!*");

    case "bot":
      return m.reply(`📊 *Bot Status:* ${data.botActive ? "✅ ON" : "🔴 OFF"}`);
  }
};

handler.command = ["bot-on", "bot-off", "bot"];
module.exports = handler;
