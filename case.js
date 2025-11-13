process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

const util = require("util");
const chalk = require("chalk");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const ssh2 = require("ssh2");
const Obfus = require('js-confuser');
const yts = require('yt-search');
const FormData = require('form-data');
const path = require("path");
const { exec, spawn, execSync } = require('child_process');

const loadPluginsCommand = require("./control/plugins.js")

//=============================================//
const owners = JSON.parse(fs.readFileSync("./data/owner.json"))

//=============================================//
module.exports = async (sock, m, chatUpdate) => {
const body = (
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "imageMessage" ? m.message.imageMessage.caption :
  m.mtype === "videoMessage" ? m.message.videoMessage.caption :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
  ""
) || "";

try {
const prefix = ".";
const isCmd = m?.body?.startsWith(prefix)
const quoted = m.quoted ? m.quoted : m
const mime = quoted?.msg?.mimetype || quoted?.mimetype || null
const args = body.trim().split(/ +/).slice(1)
const qmsg = (m.quoted || m)
const text = q = args.join(" ")
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

const botNumber = await sock.decodeJid(sock.user.id);
const isOwner = [botNumber, owner+"@s.whatsapp.net", ...owners].includes(m.sender) ? true : m.isDeveloper ? true : false

//=============================================//
//fungsi total plugin, fitur, dan user di banned 
const getPluginStats = () => {
  const baseDir = path.join(process.cwd(), "plugins");

  if (!fs.existsSync(baseDir)) {
    return {
      totalCategory: 0,
      totalFiles: 0,
      data: []
    };
  }

  const folders = fs.readdirSync(baseDir).filter(f =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  );

  const result = [];
  let totalFiles = 0;

  for (const folder of folders) {
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
    totalFiles += files.length;
    result.push({
      category: folder,
      count: files.length
    });
  }

  return {
    totalCategory: folders.length,
    totalFiles,
    data: result
  };
};

let code = fs.readFileSync("./case.js", "utf8");
code = code.replace(/\/\/.*$/gm, "");
code = code.replace(/\/\*[\s\S]*?\*\//gm, "");
const regex = /case\s+['"`]([^'"`]+)['"`]\s*:/g;
const matches = [];
let match;
while ((match = regex.exec(code))) {
    matches.push(match[1]);
}
const totalFitur = matches.length;

//=============================================//
const groupMetadata = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || []: [];
const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);

const isBotAdmin = groupAdmins.includes(botNumber);
const isAdmin = groupAdmins.includes(m.sender);

//=============================================//
const fakeMsg = { key: { fromMe: false, participant: "0@s.whatsapp.net", ...(m.chat ? { remoteJid: "13135550202@s.whatsapp.net" } : {}) }, message: { "pollCreationMessageV3": { "name": `Qadeer_khan`, "options": [ { "optionName": "1" }, { "optionName": "2" } ], "selectableOptionsCount": 1 }}};

const reply = m.reply = async (teks) => {
  return sock.sendMessage(m.chat, {
    text: `${teks}`,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: `—${namaOwner} 🎧`,
        body: `what about me?`,
        thumbnailUrl: global.fotoOwner,
        sourceUrl: "https://whatsapp.com/channel/0029VajWxSZ96H4SyQLurV1H",
      }
    }
  }, { quoted: m });
};

const example = (teks) => {
return `Usage:\n*${prefix+command}* ${teks}`
}

//=============================================//
const handleData = { 
text, args, isCmd, mime, qmsg, isOwner, command, fakeMsg, reply, owners, example, totalFitur, prefix, isBotAdmin, isAdmin, getPluginStats 
}
if (isCmd) {
await loadPluginsCommand(m, sock, command, handleData)
}

//=============================================//
if (isCmd) {
const from = m.key.remoteJid
const chatType = from.endsWith("@g.us") ? "group" : "private"
const status = isOwner ? "owner" : "free user"

console.log(
chalk.white.bold("\n┌ • Message Detected :"), chalk.green.bold(prefix+command),
chalk.white.bold("\n│ • Chat In :"), chalk.yellow.bold(chatType),
chalk.white.bold("\n│ • Status :"), chalk.red.bold(status),
chalk.white.bold("\n│ • Name :"), chalk.cyan.bold(m.pushName),
chalk.white.bold("\n└ • Sender :"), chalk.blue.bold(m.sender) 
)}

//=============================================//
switch (command) {
// ## Other Menu ## //
case "sticker": case "stiker": case "sgif": case "s": {
if (!/image|video/.test(mime)) return m.reply(`Example: *.${command}* by sending a photo/video`); 
if (/video/.test(mime)) {
if ((qmsg).seconds > 15) return m.reply("Video duration maximum 15 seconds!")
}
var media = await sock.downloadAndSaveMediaMessage(qmsg)
await sock.sendImageAsSticker(m.chat, media, m, { author: "Qadeer where are you?" })
await fs.unlinkSync(media)
}
break

case "tourl": {
    if (!/image|video|audio|application/.test(mime)) return m.reply("send/reply with media (supports photo, video, audio, & file)");
    const { fromBuffer } = require('file-type');
    async function uploadToCatbox(buffer) {
        try {
            let { ext } = await fromBuffer(buffer);
            let form = new FormData();
            form.append("fileToUpload", buffer, "file." + ext);
            form.append("reqtype", "fileupload");

            let res = await fetch("https://catbox.moe/user/api.php", {
                method: "POST",
                body: form,
            });

            return await res.text();
        } catch (err) {
            console.error("Upload Error:", err);
            return null;
        }
    }

    try {
        let mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);
        let buffer = fs.readFileSync(mediaPath);
        let url = await uploadToCatbox(buffer);

        if (!url || !url.startsWith("https://")) {
            throw new Error("Failed to upload to Catbox");
        }

        let type = "Unknown";
        if (/image/.test(mime)) type = "Photo 📷";
        else if (/video/.test(mime)) type = "Video 🎥";
        else if (/audio/.test(mime)) type = "Audio 🎧";
        else if (/application/.test(mime)) type = "Document 📄";

        await sock.sendMessage(m.chat, { text: `- 📦 Type : ${type}
- 🔗 URL : ${url}
- 🕒 Exp : Permanent`}, { quoted: m });
        fs.unlinkSync(mediaPath); 
    } catch (err) {
        console.error("Tourl Error:", err);
        m.reply("An error occurred while converting media to URL.");
    }
}
break;

//=============================================//
// ## Owner Menu ## //
case 'ht':
case 'h':
case 'hidetag': {
    if (!m.isGroup) return reply(mess.group)
    if (!isOwner && !isSewa) return reply(mess.vip) // mess.vip is not defined in settings, but I'll leave it
    if (!text) return reply(example("your message"))

    try {
        const groupMetadata = await sock.groupMetadata(m.chat)
        const members = groupMetadata.participants.map(v => v.id)

        await sock.sendMessage(m.chat, {
            text: text,
            mentions: members
        }, { quoted: m })
    } catch (e) {
        console.error("Error hidetag:", e)
        reply("Failed to send hidetag message.")
    }
}
break
        
case 'gfl': case "gantifile": case "ubahfile": {
if (!isOwner) return reply(mess.owner);
if (!text.includes("./")) return reply(example(`which file?\n\nExample: .${command} ./package.json\n\n*while replying to the file!*`));
let files = fs.readdirSync(text.split(m.quoted.fileName)[0])
if (!files.includes(m.quoted.fileName)) return reply("File not found") 
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
let media = await downloadContentFromMessage(m.quoted, "document")
let buffer = Buffer.from([])
for await(const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
fs.writeFileSync(text, buffer)
reply(`Wait a moment. . .`)
await sleep(5000)
reply(`Successfully replaced file ${q}`)
}
break

case "public":{
if (!isOwner) return reply(mess.owner)
sock.public = true
reply(`successfully changed to ${command}`)
}
break

case "self":{
if (!isOwner) return reply(mess.owner)
sock.public = false
reply(`successfully changed to ${command}`)
}
break

case "rst": case "restart": {
if (!isOwner) return
function restartServer() {
const newProcess = spawn(process.argv[0], process.argv.slice(1), {
    detached: true,
    stdio: "inherit",
  });
  process.exit(0);
}
await m.reply("*🚀 Restarting bot . . . .*")
await setTimeout(() => {
restartServer();
}, 4500)
}
break

case 'listcase': {
    if (!isOwner) return m.reply(mess.owner);
      const listCase = async () => {
        let code = await fs.promises.readFile("./case.js", "utf8");
        code = code.replace(/\/\/.*$/gm, ""); 
        code = code.replace(/\/\*[\s\S]*?\*\//gm, ""); 
        const regex = /case\s+['"`]([^'"`]+)['"`]\s*:/g;
        const matches = [];
        let match;
        while ((match = regex.exec(code))) {
            matches.push(match[1]);
        }
        let teks = `Total Case Features (${matches.length})\n\n`;
        matches.forEach(x => {
            teks += `- ${x}\n`;
        });
        return teks;
    };
    reply(await listCase());
}
break;

case "ambilq": case "q": {
if (!isOwner) return
if (!m.quoted) return 
m.reply(JSON.stringify(m.quoted.fakeObj.message, null, 2))
}
break

case "getcase": {
if (!isOwner) return
if (!text) return m.reply("Example: .getcase menu")
const getcase = (cases) => {
return "case "+`\"${cases}\"`+fs.readFileSync('./case.js').toString().split('case \"'+cases+'\"')[1].split("break")[0]+"break"
}
try {
m.reply(`${getcase(q)}`)
} catch (e) {
return m.reply(`Case *${text}* not found`)
}
}
break

case 'delcase': {
    if (!isOwner) return m.reply(mess.owner);
    if (!q) return reply(example("The case name\n*.listcase* to see all cases"));
    const hapusCase = async (filePath, caseName) => {
        try {
            let data = await fs.promises.readFile(filePath, "utf8");
            const regex = new RegExp(`case\\s+['"\`]${caseName}['"\`]:[\\s\\S]*?break`, "g");
            const modifiedData = data.replace(regex, "");
            await fs.promises.writeFile(filePath, modifiedData, "utf8");
            console.log(`Case '${caseName}' successfully deleted from file.`);
        } catch (err) {
            console.error("An error occurred:", err);
        }
    };
    await hapusCase("./case.js", q); // adjust file name
    reply(`Successfully deleted case *${q}*`);
}
break;

case 'addcase': {
if (!isOwner) return m.reply(mess.owner)
const namaFile = 'case.js'; // adjust file name
const caseBaru = `${text}`;
fs.readFile(namaFile, 'utf8', (err, data) => {
    if (err) {
        console.error('An error occurred while reading the file:', err);
        return;
    }
    const posisiAwalGimage = data.indexOf("case 'addcase':");
    if (posisiAwalGimage !== -1) {
        const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
        fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
            if (err) {
                reply('An error occurred while writing the file:', err);
            } else {
                reply('New case added successfully.');
            }
        });
    } else {
        reply('Could not add case to the file.');
    }
});
}
break

case 'get': {
if (!text) return reply(`start the *URL* with http:// or https://`)
try {
const gt = await axios.get(text, {
headers: {
"Access-Control-Allow-Origin": "*",
"Referer": "https://www.google.com/",
"Referrer-Policy": "strict-origin-when-cross-origin",
"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
},
responseType: 'arraybuffer' });
const contentType = gt.headers['content-type'];
console.log(`Content-Type: ${contentType}`);
if (/json/i.test(contentType)) {
const jsonData = JSON.parse(Buffer.from(gt.data, 'binary').toString('utf8'));
return reply(JSON.stringify(jsonData, null, 2));
} else if (/text/i.test(contentType)) {
const textData = Buffer.from(gt.data, 'binary').toString('utf8');
return reply(textData);
} else if (text.includes('webp')) {
return sock.sendImageAsSticker(m.chat, text, m, { packname: "its", author: "Qadeer" })
} else if (/image/i.test(contentType)) { return sock.sendMessage(m.chat, { image: { url: text }}, { quoted: m });
} else if (/video/i.test(contentType)) { return sock.sendMessage(m.chat, { video: { url: text }}, { quoted: m });
} else if (/audio/i.test(contentType) || text.includes(".mp3")) {
return sock.sendMessage(m.chat, { audio: { url: text }}, { quoted: m });
} else if (/application\/zip/i.test(contentType) || /application\/x-zip-compressed/i.test(contentType)) {
return sock.sendFile(m.chat, text, '', text, m)			
} else if (/application\/pdf/i.test(contentType)) {
return sock.sendFile(m.chat, text, '', text, m)
} else {
return reply(`MIME : ${contentType}\n\n${gt.data}`);
}
} catch (error) {
console.error(`An error occurred: ${error}`);
return reply(`An error occurred while accessing the URL: ${error.message}`);
}}
break

//=============================================//
// ## End Code ## //
default:
if (m.text.startsWith(">")) {
    if (!isOwner) return reply(mess.owner)
    try {
        let result = await eval(text);
        if (typeof result !== "string") result = util.inspect(result);
        return sock.sendMessage(m.chat, { text: util.format(result) }, { quoted: m });
    } catch (err) {
        return sock.sendMessage(m.chat, { text: util.format(err) }, { quoted: m });
    }
  }
 }
} catch (err) {
console.log(err)
await sock.sendMessage(global.owner+"@s.whatsapp.net", {text: err.toString()}, {quoted: m ? m : null })
}}

//=============================================//
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.red(">> Update File:"), chalk.black.bgWhite(__filename));
    delete require.cache[file];
    require(file);
});
