const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
const config = require("./config")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    const text = m.message.conversation || ""
    if (text === config.prefix + "ping") {
      await sock.sendMessage(m.key.remoteJid, { text: "Pong! MAPHUSH KUSH MD iko hewani 🚀" })
    }
  })
}

startBot()
