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
        // Humne executablePath hata diya hai taaki Puppeteer Docker mein 
        // Chrome ko apne aap (Auto-detect) dhundh le.
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED: Scan this using your WhatsApp');
});

client.on('ready', () => {
    console.log('Bot is ready and connected!');
});

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
━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${res.name || 'Unknown'}
📱 *Number:* ${res.number}
🏢 *Carrier:* ${res.carrier || 'N/A'}
📍 *Location:* ${res.city || 'N/A'}
🌍 *Country:* ${res.country || 'IN'}
`;

                msg.reply(detailsText);
            } else {
                msg.reply("❌ Details nahi mil payi.");
            }
        } catch (error) {
            console.error("API Error:", error);
            msg.reply("⚠️ Server busy hai.");
        }
    }
});

client.initialize();
