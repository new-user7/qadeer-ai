const axios = require("axios");

const handler = async (m, sock, { text, reply, command, prefix }) => {
  const header = "╔═══════✰══╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚══════✰═══╝";
  
  if (!text) {
    const usage = `
${header}

❌ Please provide a message for the AI.
📌 Usage: ${prefix}${command} Hello
`;
    return await reply(usage);
  }

  try {
    const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.message) {
      return reply("AI failed to respond. Please try again later.");
    }

    await reply(`🤖 *AI Response:*\n\n${data.message}`);
  } catch (e) {
    console.error("Error in AI command:", e);
    await reply("An error occurred while communicating with the AI.");
  }
};

handler.command = ["ai", "bot", "dj", "gpt", "gpt4", "bing"];
handler.tags = ['ai'];
handler.desc = "Chat with an AI model";
module.exports = handler;
