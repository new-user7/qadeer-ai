const handler = async (m, sock, { command, totalFitur, totalPlugin }) => {
  const os = require("os");
  const nou = require("node-os-utils");
  const speed = require("performance-now");

  async function getServerInfo(m) {
    const timestamp = speed();
    const tio = await nou.os.oos();
    const tot = await nou.drive.info();
    const memInfo = await nou.mem.info();

    const totalGB = (memInfo.totalMemMb / 1024).toFixed(2);
    const usedGB = (memInfo.usedMemMb / 1024).toFixed(2);
    const freeGB = (memInfo.freeMemMb / 1024).toFixed(2);
    const cpuCores = os.cpus().length;

    const vpsUptime = runtime(os.uptime());
    const botUptime = runtime(process.uptime());
    const latency = (speed() - timestamp).toFixed(4);

    const respon = `
╭━〔 *🤖 BOT INFO 🤖* 〕━╮
┃
┃ ⚡ *Response Speed:*  ${latency} sec
┃ ⏱️ *Bot Uptime:*  ${botUptime}
┃ 💻 *CPU Model:*  
┃    _${os.cpus()[0].model}_
┃
╰━━━━━━━━━━━━━━━━━━╯


╭━〔 *💫 SERVER INFO 💫* 〕━╮
┃
┃ 🧠 *OS Platform:*  ${nou.os.type()}
┃ 💾 *RAM:*  ${usedGB}/${totalGB} GB  _(Used)_  
┃ 💽 *Disk Space:*  ${tot.usedGb}/${tot.totalGb} GB _(Used)_
┃ ⚙️ *CPU Cores:*  ${cpuCores} Core(s)
┃ ⏳ *VPS Uptime:*  ${vpsUptime}
┃
╰━━━━━━━━━━━━━━━━━━╯
`;

    return m.reply(respon);
  }

  return getServerInfo(m);
};

handler.command = ["ping"];
module.exports = handler;