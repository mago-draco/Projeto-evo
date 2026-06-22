module.exports = {
    name: ".rebaixar",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        const user = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!user) {
            return sock.sendMessage(jid, {
                text: "❌ Marque um administrador."
            });
        }

        await sock.groupParticipantsUpdate(jid, [user], "demote");

        await sock.sendMessage(jid, {
            text: "⬇️ Administrador rebaixado."
        });
    }
};
