const {
    default: makeWASocket,
    useMultiFileAuthState
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const path = require('path');
const pino = require('pino');
const readline = require('readline');

const commands = new Map();
const cmdDir = path.join(__dirname, 'commands');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(text) {
    return new Promise(resolve => rl.question(text, resolve));
}

const loadCommands = () => {

    if (!fs.existsSync(cmdDir)) {
        return console.log('Pasta commands não encontrada!');
    }

    const files = fs.readdirSync(cmdDir)
        .filter(f => f.endsWith('.js'));

    for (const file of files) {

        try {

            const cmd = require(path.join(cmdDir, file));

            commands.set(cmd.name, cmd);

            console.log('Carregado:', cmd.name);

        } catch(err) {

            console.log(
                'Erro ao carregar',
                file,
                err
            );
        }
    }
};

async function startBot() {

    loadCommands();

    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('auth_info');
const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state
    });


    sock.ev.on('creds.update', saveCreds);


    // Verifica se já existe sessão
    if (!fs.existsSync('./auth_info/creds.json')) {

        console.log(`
╔════════════════╗
║    EVO BOT     ║
╠════════════════╣
║ 1 - QR CODE    ║
║ 2 - NÚMERO     ║
╚════════════════╝
        `);

        const escolha = await question("Escolha o método: ");


        if (escolha === "1") {

            console.log(
                "📱 Abra o WhatsApp e escaneie o QR abaixo:"
            );

            sock.opts.printQRInTerminal = true;


        } else if (escolha === "2") {

            const numero = await question(
                "Digite seu número com DDI (Ex: 5511999999999): "
            );

            const codigo = await sock.requestPairingCode(numero);

            console.log(`
═══════════════════
Seu código é:

${codigo}

═══════════════════
WhatsApp > Aparelhos conectados > Conectar com número
`);

        } else {

            console.log("❌ Opção inválida.");
            process.exit();
        }

    }


    // Sistema de comandos
    sock.ev.on("messages.upsert", async (m) => {

        const msg = m.messages[0];

        if (!msg.message || msg.key.fromMe)
            return;


        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";


        const args = text.trim().split(" ");

        const commandName =
            args[0].toLowerCase();


        if (commands.has(commandName)) {

            try {

                await commands
                    .get(commandName)
                    .execute(sock, msg, args);

            } catch (err) {

                console.error(
                    "Erro no comando:",
                    err
                );

                await sock.sendMessage(
                    msg.key.remoteJid,
                    {
                        text:
                        "❌ Erro ao executar comando."
                    }
                );
            }
        }
    });


    // Welcome e Bye
    sock.ev.on(
        "group-participants.update",
        async (data) => {

            const grupo = data.id;


            for (const participant of data.participants) {


                const user =
                    typeof participant === "string"
                    ? participant
                    : participant.id ||
                      participant.jid ||
                      "";


                if (!user)
                    continue;


                if (data.action === "add") {

                    await sock.sendMessage(
                        grupo,
                        {
                            text:
`👋 Olá @${user.split("@")[0]}!

Seja muito bem-vindo ao grupo! 🎉

Leia as regras e aproveite sua estadia.`,
                            mentions: [user]
                        }
                    );

                }


                if (data.action === "remove") {

                    await sock.sendMessage(
                        grupo,
                        {
                            text:
`👋 Adeus @${user.split("@")[0]}!

Foi bom ter você aqui. 🙏

Se foi banido:
🚫 Vá com Deus e nunca mais volte.`,
                            mentions: [user]
                        }
                    );

                }

            }

        }
    );

    rl.close();
}


startBot();
