module.exports = {
    name: ".totag",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        if (!jid.endsWith("@g.us")) {
            return sock.sendMessage(jid, {
                text: "❌ Somente em grupos."
            });
        }

        const metadata = await sock.groupMetadata(jid);

        const membros = metadata.participants.map(
            p => p.id
        );

        const quoted = msg.message?.extendedTextMessage?.contextInfo;

        if (!quoted) {
            return sock.sendMessage(jid, {
                text: "Responda uma mensagem com .totag"
            });
        }

        const texto =
            quoted.quotedMessage?.conversation ||
            quoted.quotedMessage?.extendedTextMessage?.text ||
            "📢 Mensagem marcada";

        await sock.sendMessage(jid, {
            text: texto,
            mentions: membros
        });
    }
};
