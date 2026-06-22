const axios = require('axios');
module.exports = {
    name: '.git',
    async execute(sock, msg, args) {
        const query = args.slice(1).join(' ');
        if (!query) return sock.sendMessage(msg.key.remoteJid, { text: 'Digite o nome do repo.' });
        try {
            const res = await axios.get('https://api.github.com/search/repositories?q=' + encodeURIComponent(query));
            const repo = res.data.items[0];
            await sock.sendMessage(msg.key.remoteJid, { text: '💻 *' + repo.full_name + '*\n🔗 ' + repo.html_url });
        } catch (e) { await sock.sendMessage(msg.key.remoteJid, { text: 'Erro na busca.' }); }
    }
};
