module.exports = {
    name: ".promote",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        if (!jid.endsWith("@g.us")) {
            return sock.sendMessage(jid, {
                text: "❌ Apenas em grupos."
            });
        }

        const user = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!user) {
            return sock.sendMessage(jid, {
                text: "❌ Marque um usuário."
            });
        }

        await sock.groupParticipantsUpdate(jid, [user], "promote");

        await sock.sendMessage(jid, {
            text: "👑 Usuário promovido."
        });
    }
};
