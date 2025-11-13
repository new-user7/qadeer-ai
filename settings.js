const chalk = require("chalk");
const fs = require("fs");

// ~~ setting pairing kode ~~
// global.pairingCode = "PKQADEER"

// ~~ setting bot ~~
global.owner = "923151105391"
global.owner2 = [
"923079749129", "923498344152"
] //buat fitur bot on/off

global.namaOwner = "Qadeer_Khan"
global.namaBot = "Qadeer MD"
global.versiBot = "1.0"

// ~~ setting foto ~~
global.fotoOwner = "https://qu.ax/yyTAH.jpg"

// ~~ setting saluran ~~
global.idChannel = "120363299692857279@newsletter"
global.namaChannel = "cyber worrior"


global.mess = {
 owner: "*Sorry, this feature can only be used by the bot owner!*",
 admin: "*Sorry, this feature can only be used by group admins!*",
 botAdmin: "*Sorry, it seems the bot needs to be an admin in this group!*",
 group: "*Sorry, this feature can only be used inside a group chat!*"
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.red(">> Update File:"), chalk.black.bgWhite(__filename));
    delete require.cache[file];
    require(file);
});
