process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

require("./settings.js")
require("./control/function.js")
const {
        default: makeWASocket,
        makeCacheableSignalKeyStore,
        fetchLatestWaWebVersion,
        DisconnectReason,
        fetchLatestBaileysVersion,
        generateForwardMessageContent,
        prepareWAMessageMedia,
        generateWAMessageFromContent,
        generateMessageID,
        downloadContentFromMessage,
        makeInMemoryStore,
        getContentType,
        jidDecode,
    MessageRetryMap,
        proto,
        delay,
        Browsers,
        initAuthCreds
} = require("@whiskeysockets/baileys")

const { say } = require("cfonts");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const path = require("path");
const fs = require('fs');
const chalk = require("chalk");
const axios = require("axios");
const FileType = require('file-type');
const os = require('os');
const nou = require('node-os-utils');

const owners = JSON.parse(fs.readFileSync("./data/owner.json"))
const set = JSON.parse(fs.readFileSync('./data/setbot.json'));
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./control/webp.js')

const ConfigBaileys = require("./control/config.js");

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function useMemoryAuthState(sessionContent) {
    const creds = sessionContent ? sessionContent.creds : initAuthCreds();
    const keys = sessionContent ? sessionContent.keys : {};

    const keyStore = {
        get: async (type, ids) => {
            const data = {};
            for (let id of ids) {
                let value = keys[`${type}-${id}`];
                if (type === 'app-state-sync-key' && value) {
                    value = proto.Message.AppStateSyncKeyData.fromObject(value);
                }
                data[id] = value;
            }
            return data;
        },
        set: async (data) => {
            for (let type in data) {
                for (let id in data[type]) {
                    keys[`${type}-${id}`] = data[type][id];
                }
            }
            saveCreds();
        }
    };

    const state = { creds, keys: makeCacheableSignalKeyStore(keyStore, pino({ level: "silent" })) };

    const saveCreds = () => {
        const session = {
            creds: state.creds,
            keys
        };
        const base64Session = Buffer.from(JSON.stringify(session, (key, value) => {
            if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
                return { type: 'Buffer', data: value.data };
            }
            return value;
        })).toString('base64');
        console.log('SESSION_ID=' + base64Session);
    };

    return { state, saveCreds };
}

async function startBot() {
    const SESSION_ID = process.env.SESSION_ID;
    if (!SESSION_ID) {
        console.error('SESSION_ID environment variable is required.');
        process.exit(1);
    }

    let sessionContent = null;
    try {
        const decoded = Buffer.from(SESSION_ID, 'base64').toString('utf-8');
        sessionContent = JSON.parse(decoded, (key, value) => {
            if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
                return Buffer.from(value.data);
            }
            return value;
        });
        console.log('Using provided SESSION_ID for authentication.');
    } catch (err) {
        console.error('Invalid SESSION_ID:', err);
        process.exit(1);
    }

    const { state, saveCreds } = await useMemoryAuthState(sessionContent);
    const { version, isLatest } = await fetchLatestWaWebVersion();

    const sock = makeWASocket({
        browser: Browsers.ubuntu("Firefox"),  
        generateHighQualityLinkPreview: true,  
        printQRInTerminal: false,
        auth: state,        
        version: version,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return sock
        },
        logger: pino({ level: "silent" })
    });

    store?.bind(sock.ev)
    console.clear();

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (!connection) return;
      if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.error(lastDisconnect.error);

      switch (reason) {
       case DisconnectReason.badSession:
          console.log("Bad Session File, Please Delete Session and Scan Again");
          process.exit();
        case DisconnectReason.connectionClosed:
          console.log("[SYSTEM] Connection closed, reconnecting...");
          await startBot();
        case DisconnectReason.connectionLost:
          console.log("[SYSTEM] Connection lost, trying to reconnect...");
          await startBot();
        case DisconnectReason.connectionReplaced:
          console.log("Connection Replaced, Another New Session Opened. Please Close Current Session First.");
          await sock.logout();
        break;
        case DisconnectReason.restartRequired:
          console.log("Restart Required...");
          await startBot();
        case DisconnectReason.loggedOut:
          console.log("Device Logged Out, Please Scan Again And Run.");
          await sock.logout();
        break;
        case DisconnectReason.timedOut:
          console.log("Connection TimedOut, Reconnecting...");
          await startBot();
        default:
        if (lastDisconnect.error === "Error: Stream Errored (unknown)") {
        process.exit();
        }
      }
    } else if (connection === "open") {
      console.clear()
      await startCode(sock); 
      try {
      sock.newsletterFollow("120363345872435489@newsletter")
      } catch {}
      try {
      sock.newsletterFollow("120363299692857279@newsletter")
      } catch {}

      // Save and log the SESSION_ID after successful connection
      saveCreds();

      console.log(chalk.white.bold(`\n Successfully connected 🍀\n`));
 }
});

sock.public = true

sock.ev.on('messages.upsert', async (chatUpdate) => {
  try {
    const msg = chatUpdate.messages[0];
    if (!msg.message) return;
    let m = await ConfigBaileys(sock, msg);

    const isOwner =
  (Array.isArray(global.owner2)
    ? global.owner2.map(n => n + "@s.whatsapp.net").includes(m.sender)
    : m.sender === global.owner2 + "@s.whatsapp.net") ||
  m.key.fromMe;

    if (!sock.public && !isOwner) return;
    if (m.isBaileys) return;

    if (!set.botActive && !isOwner) return;

    require("./case.js")(sock, m, chatUpdate);

  } catch (err) {
    console.log('Error on message:', err);
  }
});


  sock.ev.on("call", async (celled) => {
  let anticall = set.anticall
  if (!anticall) return

  for (let data of celled) {
    if (!data.isGroup && data.status === "offer") {

      await sock.sendMessage(data.from, {
        text: `*${namaBot}* cannot receive ${data.isVideo ? `*video*` : `*voice*`} calls

- _Sorry @${data.from.split("@")[0]} you will be blocked for calling!_`,
        mentions: [data.from]
      })

      await sleep(5000)
      await sock.updateBlockStatus(data.from, "block")
    }
  }
})

    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    sock.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
        ? message.mtype.replace(/Message/gi, "")
        : mime.split("/")[0];
    const Randoms = Date.now()
    const fil = Randoms
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? "./data/trash/" + fil + "." + type.ext : filename;
    await fs.writeFileSync(trueFileName, buffer);

    return trueFileName;
    };


   sock.downloadM = async (m, type, filename = '') => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
        }
        if (filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
   }


   sock.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
    } else {
        buffer = await imageToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

    sock.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
        ? path
        : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`, `[1], 'base64')
        : /^https?:\/\//.test(path)
        ? await (await getBuffer(path))
        : fs.existsSync(path)
        ? fs.readFileSync(path)
        : Buffer.alloc(0);

    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
    } else {
        buffer = await videoToWebp(buff);
    }

    await sock.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
    };

    sock.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, './data/trash/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename,
        data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    sock.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await sock.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await sock.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await sock.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

    sock.sendContact = async (jid, kon = [], name, desk = "Developer Bot", quoted = '', opts = {}) => {
    const list = kon.map(i => ({
      displayName: typeof name !== 'undefined' ? name : 'Unknown',
      vcard:
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `N:;${name || 'Unknown'};;;\n` +
        `FN:${name || 'Unknown'}\n` +
        'ORG:Unknown\n' +
        'TITLE:\n' +
        `item1.TEL;waid=${i}:${i}\n` +
        'item1.X-ABLabel:Ponsel\n' +
        `X-WA-BIZ-DESCRIPTION:${desk}\n` +
        `X-WA-BIZ-NAME:${name || 'Unknown'}\n` +
        'END:VCARD'
    }));

    await sock.sendMessage(
      jid,
      { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts },
      { quoted }
    );
   }
 }

startBot();