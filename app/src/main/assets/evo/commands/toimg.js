const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
    name: ".toimg",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted || !quoted.stickerMessage) {
            return sock.sendMessage(jid, {
                text: "🖼️ Marque uma figurinha com .toimg"
            });
        }

        try {
            const buffer = await sock.downloadMediaMessage({
                message: quoted
            });

            const webp = "temp.webp";
            const png = "temp.png";

            fs.writeFileSync(webp, buffer);

            exec(`ffmpeg -i ${webp} ${png}`, async (err) => {

                if (err) {
                    return sock.sendMessage(jid, {
                        text: "❌ Erro ao converter figurinha."
                    });
                }

                await sock.sendMessage(jid, {
                    image: {
                        url: png
                    },
                    caption: "🖼️ Convertido!"
                });

                fs.unlinkSync(webp);
                fs.unlinkSync(png);
            });

        } catch (e) {
            console.log(e);
            await sock.sendMessage(jid, {
                text: "❌ Erro ao baixar a figurinha."
            });
        }
    }
};
