const wiki = require('wikipedia');

module.exports = {
    name: '.wiki',
    async execute(sock, msg, args) {
        const query = args.slice(1).join(' ');
        if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'O que deseja pesquisar na Wikipedia?' });

        try {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Buscando na Wiki...' });
            const page = await wiki.page(query);
            const summary = await page.summary();
            
            await sock.sendMessage(msg.key.remoteJid, { text: `📖 *${summary.title}*\n\n${summary.extract}` });
        } catch (err) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Termo não encontrado.' });
        }
    }
};
