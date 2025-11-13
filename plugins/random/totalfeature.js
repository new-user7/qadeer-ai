const handler = async (m, sock, { command, reply, totalFitur, getPluginStats, text }) => {

const info = getPluginStats();

const qadeerdev =`*Total Features*
> Total Case Features : ${totalFitur}
> Total files : (${info.totalFiles}) plugin 
> Folder category : (${info.totalCategory}) folders`
reply(qadeerdev)
}

handler.command = ["totalfeature","features"]
module.exports = handler
