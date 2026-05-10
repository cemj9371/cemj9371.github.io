// api/telegram.js
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const TELEGRAM_CONFIG = {
        BOT_TOKEN: '8576907699:AAERUGDvOzciJqZuCZDcK-jkvwupAjSFIkw',
        CHAT_ID: '953712851',
        API_URL: 'https://api.telegram.org/bot'
    };
    
    try {
        const { message, caption, document, fileName } = req.body;
        
        // Handle document/file sending
        if (document && fileName) {
            // For documents, we need to handle differently
            // This is a simplified version
            const response = await fetch(`${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.CHAT_ID,
                    text: `📄 Document: ${fileName}\n\n${document.substring(0, 3900)}`,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            return res.status(200).json({ success: response.ok, data });
        }
        
        // Handle regular message
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const response = await fetch(`${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: message.substring(0, 4096),
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(500).json({ success: false, error: data });
        }
        
    } catch (error) {
        console.error('Telegram API error:', error);
        return res.status(500).json({ error: error.message });
    }
}