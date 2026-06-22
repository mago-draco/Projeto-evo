module.exports = {
    name: ".ban",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        const user = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!user) {
            return sock.sendMessage(jid, {
                text: "❌ Marque alguém para banir."
            });
        }

        await sock.groupParticipantsUpdate(jid, [user], "remove");

        await sock.sendMessage(jid, {
            text: "🚫 Usuário removido do grupo."
        });
    }
};
