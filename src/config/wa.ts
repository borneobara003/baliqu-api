import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

export async function connectToWhatsApp() {
  const { saveCreds, state } = await useMultiFileAuthState("baileys_auth_info");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (connection === "close") {
      connectToWhatsApp();
    } else if (connection === "open") {
      console.log("opened connection");
    } else if (connection === "connecting") {
      console.log("connecting");
    }
    if (qr) {
      console.log("got qr code", qr);
    }
  });
  sock.ev.on("creds.update", async () => {
    await saveCreds();
  });
  sock.ev.on("messages.upsert", (update) => {
    console.log("got messages.upsert");
    console.log("got messages.upsert", update.type);
    const { messages, type } = update;
    if (type === "append") return;
    const message = messages[0];
    console.log("got messages.upsert", message);
    if (message.key.remoteJid) {
      sock.sendMessage(message.key.remoteJid, {
        text: "Hello world",
      });
    }
  });

  return sock;
}
