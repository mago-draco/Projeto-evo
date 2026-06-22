module.exports = {
    name: ".clean",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        let texto = "🧹 Limpando o chat...";

        for (let i = 0; i < 1000; i++) {
            texto += "\n";
        }

        texto += "✨ Chat limpo com sucesso!";

        await sock.sendMessage(jid, {
            text: texto
        });
    }
};
