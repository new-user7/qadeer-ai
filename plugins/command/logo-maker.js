const axios = require("axios");

// Helper function (same as original)
function getApiUrl(type, name) {
  const encodedName = encodeURIComponent(name);
  const baseApi = "https://api-pink-venom.vercel.app/api/logo?url=";

  const urls = {
    "3dcomic": `https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=${encodedName}`,
    "dragonball": `https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=${encodedName}`,
    "deadpool": `https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html&name=${encodedName}`,
    "blackpink": `https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=${encodedName}`,
    "neonlight": `https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=${encodedName}`,
    "cat": `https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html&name=${encodedName}`,
    "sadgirl": `https://en.ephoto360.com/write-text-on-wet-glass-online-589.html&name=${encodedName}`,
    "pornhub": `https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html&name=${encodedName}`,
    "naruto": `https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=${encodedName}`,
    "thor": `https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html&name=${encodedName}`,
    "america": `https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html&name=${encodedName}`,
    "eraser": `https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html&name=${encodedName}`,
    "3dpaper": `https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html&name=${encodedName}`,
    "futuristic": `https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html&name=${encodedName}`,
    "clouds": `https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html&name=${encodedName}`,
    "sans": `https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html&name=${encodedName}`,
    "galaxy": `https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html&name=${encodedName}`,
    "leaf": `https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html&name=${encodedName}`,
    "sunset": `https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html&name=${encodedName}`,
    "khan": `https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html&name=${encodedName}`,
    "devilwings": `https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html&name=${encodedName}`,
    "hacker": `https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html&name=${encodedName}`,
    "boom": `https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html&name=${encodedName}`,
    "luxury": `https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html&name=${encodedName}`,
    "zodiac": `https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html&name=${encodedName}`,
    "angelwings": `https://en.ephoto360.com/angel-wing-effect-329.html&name=${encodedName}`,
    "bulb": `https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html&name=${encodedName}`,
    "tatoo": `https://en.ephoto360.com/make-tattoos-online-by-Qadeer-tech-309.html&name=${encodedName}`,
    "castle": `https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html&name=${encodedName}`,
    "frozen": `https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html&name=${encodedName}`,
    "paint": `https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html&name=${encodedName}`,
    "birthday": `https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html&name=${encodedName}`,
    "typography": `https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html&name=${encodedName}`,
    "bear": `https://en.ephoto360.com/free-bear-logo-maker-online-673.html&name=${encodedName}`,
  };

  if (urls[type]) {
    return baseApi + urls[type];
  }
  return null;
}

const handler = async (m, sock, { args, reply, command, prefix }) => {
  const header = "╔══════════════✰════╗\n       𝐐𝐀𝐃𝐄𝐄𝐑-𝐌𝐃\n╚═════════════✰═════╝";

  try {
    const logoType = args[0] ? args[0].toLowerCase() : "";
    const textQuery = args.slice(1).join(" ");

    const logoTypes = [
      "3dcomic", "dragonball", "deadpool", "blackpink", "neonlight", "cat", 
      "sadgirl", "pornhub", "naruto", "thor", "america", "eraser", "3dpaper", 
      "futuristic", "clouds", "sans", "galaxy", "leaf", "sunset", "khan", 
      "devilwings", "hacker", "boom", "luxury", "zodiac", "angelwings", "bulb", 
      "tatoo", "castle", "frozen", "paint", "birthday", "typography", "bear", "valorant"
    ];

    if (!logoType || !logoTypes.includes(logoType)) {
      const text = `
${header}

❌ Invalid logo type.
📌 Usage: ${prefix}${command} <type> <text>

*Available Types:*
${logoTypes.join(", ")}
`;
      return await reply(text);
    }

    // Special case for 'valorant'
    if (logoType === "valorant") {
      const [text1, text2, ...rest] = args.slice(1);
      const text3 = rest.join(" ");
      if (!text1 || !text2 || !text3) {
        const text = `
${header}

❌ Valorant logo requires 3 text inputs.
📌 Usage: ${prefix}${command} valorant <text1> <text2> <text3>
`;
        return await reply(text);
      }
      
      const apiUrl = `https://api.nexoracle.com/ephoto360/valorant-youtube-banner?apikey=MepwBcqIM0jYN0okD&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}`;
      
      await reply("Creating Valorant banner...");
      const { data: buffer } = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      return await sock.sendMessage(m.chat, { image: buffer, caption: "Here is your Valorant YouTube banner!" }, { quoted: m });
    }

    // Standard logos
    if (!textQuery) {
      const text = `
${header}

❌ Please provide text for the logo.
📌 Usage: ${prefix}${command} ${logoType} <text>
`;
      return await reply(text);
    }

    const processingText = `
${header}

🎨 Creating your *${logoType}* logo: *${textQuery}*...
`;
    await reply(processingText);

    const apiUrl = getApiUrl(logoType, textQuery);
    if (!apiUrl) {
      throw new Error("Logo type is valid but URL function failed.");
    }

    const { data: result } = await axios.get(apiUrl);

    if (!result?.result?.download_url) {
      throw new Error("API did not return a download URL.");
    }

    const caption = `
${header}

✅ Here is your *${logoType}* logo!
`;

    await sock.sendMessage(
      m.chat,
      {
        image: { url: result.result.download_url },
        caption: caption,
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    const text = `
${header}

❌ Failed to create logo!
⚠️ ${err.message}
`;
    await reply(text);
  }
};

handler.command = ["logo", "logomaker", "ephoto"];
module.exports = handler;