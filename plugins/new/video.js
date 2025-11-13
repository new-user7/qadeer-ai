const axios = require("axios");
const yts = require("yt-search");

const handler = async (m, sock, { text, reply, command, prefix }) => {
  const header = "╔══════════✰════╗\n       𝐈𝐂𝐎𝐍𝐈𝐂-𝐌𝐃\n╚═════════✰═════╝";

  if (!text) {
    const usage = `
${header}

❌ No video specified!
📌 Usage: ${prefix}${command} <title or URL>
`;
    return await reply(usage);
  }

  try {
    let url;
    if (text.includes("youtube.com") || text.includes("youtu.be")) {
      url = text;
    } else {
      let search = await yts(text);
      if (!search || !search.videos || search.videos.length === 0) return reply("No results found.");
      url = search.videos[0].url;
    }
    
    await reply(`🎥 Downloading video: *${url}*...`);

    // NOTE: Yeh API key 'APIKEY' hardcoded thi. Yeh shayad fail ho.
    let { data } = await axios.get(`https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(url)}`);

    if (!data || !data.status) return reply("Failed to fetch video from API.");

    let videoUrl = data.result?.media?.video_url_hd && data.result.media.video_url_hd !== "No HD video URL available"
      ? data.result.media.video_url_hd
      : data.result?.media?.video_url_sd;

    if (!videoUrl) return reply("No downloadable video found.");

    await sock.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption: `🎬 ${data.result?.title || "‎*𝚀𝙰𝙳𝙴𝙴𝚁-𝙰𝙸 𝚈𝚃 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁*"}\n\n*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*`
      },
      { quoted: m }
    );

  } catch (e) {
    reply("❌ Error while fetching video.");
    console.log("Video Command Error:", e);
  }
};

handler.command = ["video", "vid", "ytv"];
handler.tags = ['downloader'];
handler.desc = "Download YouTube Video";
module.exports = handler;
