const fs = require('fs');
const path = require('path');

module.exports = {
    name: '.menu',
    async execute(sock, msg) {
        const cmdDir = __dirname; // Já está na pasta commands
        const commandFiles = fs.readdirSync(cmdDir).filter(file => file.endsWith('.js'));
        
        let menuText = "*📋 MENU PROJETO EVO*\n\n";

        commandFiles.forEach(file => {
            // Remove a extensão .js para listar o nome do comando
            const commandName = file.replace('.js', '');
            menuText += `• .${commandName}\n`;
        });

        menuText += "\n_Use o comando correspondente para executar._";
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    }
};
