const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: ".play",

    async execute(sock, msg, args) {
        let query = args.slice(1).join(" ");

        if (!query) {
            return sock.sendMessage(msg.key.remoteJid, {
                text:
                    "🎵 Uso:\n" +
                    ".play música\n" +
                    ".play 1 vídeo\n" +
                    ".play link"
            });
        }

        const isVideo = query.startsWith("1 ");

        if (isVideo) {
            query = query.replace(/^1\s+/, "");
        }

        const isLink = /^https?:\/\//i.test(query);
        const isYoutube = /youtube\.com|youtu\.be/i.test(query);

        const ext = isVideo ? "mp4" : "mp3";
        const output = path.join(
            __dirname,
            `temp_${Date.now()}.${ext}`
        );

        let command;

        if (isVideo) {

            if (!isLink) {
                // Pesquisa no YouTube
                command = `yt-dlp -f "best[height<=480]" -o "${output}" "ytsearch1:${query}"`;

            } else if (isYoutube) {
                // Link do YouTube
                command = `yt-dlp -f "best[height<=480]" -o "${output}" "${query}"`;

            } else {
                // TikTok, Instagram, X, etc.
                command = `yt-dlp -f "bv*+ba/b" -o "${output}" "${query}"`;
            }

        } else {

            if (isLink) {
                // Link de qualquer plataforma
                command = `yt-dlp -x --audio-format mp3 --audio-quality 5 -o "${output}" "${query}"`;

            } else {
                // Pesquisa no YouTube
                command = `yt-dlp -x --audio-format mp3 --audio-quality 5 -o "${output}" "ytsearch1:${query}"`;
            }
        }


        await sock.sendMessage(msg.key.remoteJid, {
            text: "⏳ Baixando mídia..."
        });


        exec(command, async (error, stdout, stderr) => {

            if (error || !fs.existsSync(output)) {

                console.error(stderr);

                return sock.sendMessage(msg.key.remoteJid, {
                    text: "❌ Falha ao baixar a mídia."
                });
            }

            try {

                const size =
                    (fs.statSync(output).size / 1024 / 1024)
                    .toFixed(2);

                console.log(
                    `📦 Enviando ${ext.toUpperCase()} | ${size} MB`
                );


                if (isVideo) {

                    await sock.sendMessage(
                        msg.key.remoteJid,
                        {
                            video: {
                                url: output
                            },
                            caption: "🎬 Aqui está seu vídeo!"
                        }
                    );

                } else {

                    await sock.sendMessage(
                        msg.key.remoteJid,
                        {
                            audio: {
                                url: output
                            },
                            mimetype: "audio/mpeg",
                            ptt: false
                        }
                    );
                }


                await sock.sendMessage(msg.key.remoteJid, {
                    text: "✅ Envio concluído!"
                });

            } catch (err) {

                console.error("Erro no envio:", err);

                await sock.sendMessage(msg.key.remoteJid, {
                    text: "❌ Erro ao enviar a mídia."
                });

            } finally {

                if (fs.existsSync(output)) {

                    fs.unlinkSync(output);

                    console.log(
                        "🗑️ Arquivo temporário removido."
                    );
                }
            }
        });
    }
};
