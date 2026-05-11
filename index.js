require('./system/setting');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk')
const readline = require("readline")
const axios = require('axios'); // Added for GitHub database
const { smsg, fetchJson, await, sleep } = require('./system/lib/myfunction');
//======================
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const usePairingCode = true

const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})};


//======================
async function StartNato() {
const { state, saveCreds } = await useMultiFileAuthState('./session')
const nato = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: !usePairingCode,
auth: state,
browser: [ "Ubuntu", "Chrome", "20.0.04" ]
});
//======================
if (usePairingCode && !nato.authState.creds.registered) {
console.log(chalk.cyan("-[ 🔗 Time To Pairing! ]"));
const phoneNumber = await question(chalk.green("-📞 Enter Your Number Phone::\n"));

const code = await nato.requestPairingCode(phoneNumber.trim(), "MINATODV");//set your pairing code
console.log(chalk.blue(`-✅ Pairing Code: `) + chalk.magenta.bold(code));
}
nato.public = global.publik
//======================
nato.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
const reconnect = () => StartNato();
const reasons = {
[DisconnectReason.badSession]: "Bad Session!",
[DisconnectReason.connectionClosed]: "Connetion Closed ...",
[DisconnectReason.connectionLost]: "Connetion lost ...",
[DisconnectReason.connectionReplaced]: "Session Remplaced ",
[DisconnectReason.loggedOut]: "LoggedOut!",
[DisconnectReason.restartRequired]: "Restart Required...",
[DisconnectReason.timedOut]: "TimeOut..."};
console.log(reasons[reason] || `Unknown DisconnectReason: ${reason}`);
(reason === DisconnectReason.badSession || reason === DisconnectReason.connectionReplaced) ? conn() : reconnect()}
if (connection === "open") {
      if ("120363404759959596@newsletter")
        try {
    await nato.newsletterFollow("120363404759959596@newsletter");
  } catch (err) {
    console.log("Newsletter follow failed:", err.message || err);
  }
  console.log(chalk.red.bold("-[ WhatsApp Connected ! ]"));
console.log(chalk.red.bold("-[ WhatsApp Connected ! ]"));
}});
//==========================//
nato.ev.on("messages.upsert", async ({
messages,
type
}) => {
try {
const msg = messages[0] || messages[messages.length - 1]
if (type !== "notify") return
if (!msg?.message) return
if (msg.key && msg.key.remoteJid == "status@broadcast") return
const m = smsg(nato, msg, store)
require(`./system/handler`)(nato, m, msg, store)
} catch (err) { console.log((err)); }})
//=========================//
nato.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && decode.user + '@' + decode.server || jid;
} else return jid;
};
//=========================//
nato.sendText = (jid, text, quoted = '', options) => nato.sendMessage(jid, { text: text, ...options }, { quoted });
nato.ev.on('contacts.update', update => {
for (let contact of update) {
let id = nato.decodeJid(contact.id);
if (store && store.contacts) {
store.contacts[id] = { id, name: contact.notify };
}
}
});
nato.ev.on('creds.update', saveCreds);
return nato;
}
//=============================//
console.log(chalk.green.bold(
`⠀⠀

    WELCOME IN THE BASE BOT
    
    
    ${chalk.red.bold("[BASE BOT V1 2026-2027]")} 
────────────────────────────
────────────────────────────`));
StartNato()
//======================