const handler = async (m, sock, { isRegis }) => {
await sock.sendContact(m.chat, [global.owner], global.namaOwner, "Developer Bot", m)
await m.reply(`Hi *${m.pushName}*, this is my creator's contact ✨`)
}

handler.command = ["owner", "own"]
module.exports = handler
