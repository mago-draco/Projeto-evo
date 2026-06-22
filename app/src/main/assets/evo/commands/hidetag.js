module.exports = {
    name: ".hidetag",

    async execute(sock, msg, args) {
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

        const texto = args.slice(1).join(" ");

        if (!texto) {
            return sock.sendMessage(jid, {
                text: "Use: .hidetag sua mensagem"
            });
        }

        await sock.sendMessage(jid, {
            text: texto,
            mentions: membros
        });
    }
};
