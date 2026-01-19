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
    const cmd = text.toLowerCase()

    // PING
    if (cmd === config.prefix + "ping") {
      return sock.sendMessage(m.key.remoteJid, { text: "🏓 Pong! Bot iko hewani ✅" })
    }

    // TEST
    if (cmd === config.prefix + "test") {
      return sock.sendMessage(m.key.remoteJid, { text: "✅ Test successful. Bot inafanya kazi." })
    }

    // REPO
    if (cmd === config.prefix + "repo") {
      return sock.sendMessage(
        m.key.remoteJid,
        { text: "🤖 MAPHUSH KUSH MD\nRepo: GitHub yako binafsi" }
      )
    }

    // MENU
    if (cmd === config.prefix + "menu") {
      const menu = `
╭━━━〔 🤖 MAPHUSH KUSH MD 〕━━━╮
┃ 👤 Owner: MAPHUSH KUSH
┃ ⚡ Prefix: ${config.prefix}
╰━━━━━━━━━━━━━━━━━━━━╯

╭─❰ 🔧 TOOLS ❱─╮
│ • ${config.prefix}ping
│ • ${config.prefix}test
│ • ${config.prefix}repo
│ • ${config.prefix}menu
╰─────────────╯

📌 Bot bado iko mwanzo
📌 Commands zaidi zinakuja
`
      return sock.sendMessage(m.key.remoteJid, { text: menu })
    }
  })
}

startBot()
