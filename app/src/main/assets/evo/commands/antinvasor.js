const fs = require("fs");
const path = require("path");

const db = path.join(__dirname, "antinvasor.json");

function load() {
    if (!fs.existsSync(db)) {
        fs.writeFileSync(db, "{}");
    }
    return JSON.parse(fs.readFileSync(db));
}

module.exports = {
    name: ".antinvasor",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const data = load();

        const status = args[1];

        if (status === "on") {
            data[jid] = true;
        } else if (status === "off") {
            delete data[jid];
        } else {
            return sock.sendMessage(jid, {
                text: "Use .antinvasor on ou off"
            });
        }

        fs.writeFileSync(db, JSON.stringify(data, null, 2));

        sock.sendMessage(jid, {
            text: `🛡️ Antinvasor ${status === "on" ? "ativado" : "desativado"}`
        });
    }
};
