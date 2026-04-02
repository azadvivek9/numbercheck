const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const http = require('http');

// Render/Cloud uptime ke liye basic server
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Bot is Active\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Docker use kar rahe ho toh ye path kaam karega
        executablePath: '/usr/bin/google-chrome-stable', 
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED: Scan this using your new WhatsApp number');
});

client.on('ready', () => {
    console.log('Bot is ready and connected!');
});

// Single message listener with correct syntax
client.on('message', async (msg) => {
    const text = msg.body.toLowerCase();
    const numberMatch = text.match(/\d{10}/);
    const triggerPhrase = text.includes("ye kiska number hai");

    if (numberMatch && triggerPhrase) {
        const phoneNumber = numberMatch[0];
        console.log(`Processing request for: ${phoneNumber}`);
        
        try {
            const apiUrl = `https://ansh-apis.is-dev.org/api/truecaller?key=ansh&q=${phoneNumber}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.status && data.result) {
                const res = data.result;
                const detailsText = `
*📞 Number Details Found*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${res.name || 'Unknown'}
📱 *Number:* ${res.number}
🏢 *Carrier:* ${res.carrier || 'N/A'}
📍 *Location:* ${res.city || 'N/A'}
🌍 *Country:* ${res.country || 'IN'}`;

                msg.reply(detailsText);
            } else {
                msg.reply("❌ Is number ki details nahi mil payi.");
            }
        } catch (error) {
            console.error("API Error:", error);
            msg.reply("⚠️ Server busy hai, thodi der baad try karein.");
        }
    }
});

client.initialize();
