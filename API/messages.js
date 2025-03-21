// api/messages.js
import fs from 'fs';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

// Load messages from file
function loadMessages() {
    if (fs.existsSync(MESSAGES_FILE)) {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        return JSON.parse(data);
    }
    return {};
}

// Save messages to file
function saveMessages(messages) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export default async function handler(req, res) {
    const { channel } = req.query;

    if (req.method === 'GET') {
        // Get messages for a channel
        const messages = loadMessages();
        res.status(200).json(messages[channel] || []);
    } else if (req.method === 'POST') {
        // Send a message to a channel
        const { author, avatar, text, media } = req.body;

        const messages = loadMessages();
        if (!messages[channel]) {
            messages[channel] = [];
        }

        const newMessage = {
            author,
            avatar,
            text,
            media,
            timestamp: new Date().toISOString()
        };

        messages[channel].push(newMessage);
        saveMessages(messages);

        res.status(200).json(newMessage);
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
