/**
 * ULTIMATE_100 - A WhatsApp Bot
 * Update Command - Safely pulls updates and reinstalls dependencies automatically
 */

const { exec } = require('child_process');

// Helper to wrap messages in the requested ULTIMATE_100 box format
function formatCardMessage(titleLines) {
    const content = titleLines.join('\n');
    return (
        `╭╼━≪• 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄_𝟏𝟎𝟎 •≫━╾╮\n` +
        `${content}\n` +
        `╰━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `> _⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄_𝟏𝟎𝟎_`
    );
}

async function updateCommand(sock, chatId, message) {
    try {
        const startMsg = formatCardMessage([
            '┃ 🔄 *System Update Initiated*',
            '┃ ⏳ *Pulling latest changes and installing dependencies...*'
        ]);
        await sock.sendMessage(chatId, { text: startMsg }, { quoted: message });

        exec('git pull && npm install', async (error, stdout, stderr) => {
            if (error) {
                console.error('[Update Error]:', error);
                const errorMsg = formatCardMessage([
                    '┃ ❌ *Update Failed*',
                    `┃ ⚠️ *${error.message}*`
                ]);
                return await sock.sendMessage(chatId, { text: errorMsg }, { quoted: message });
            }

            const successMsg = formatCardMessage([
                '┃ ✅ *Update Successful!*',
                '┃ 🔄 *Dependencies synchronized.*',
                '┃ 🚀 *Restarting bot...*'
            ]);
            
            await sock.sendMessage(chatId, { text: successMsg }, { quoted: message });
            
            // Optional: Exit process so PM2 or your process manager restarts the bot cleanly
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        });

    } catch (err) {
        console.error('[Update Command Exception]:', err);
        const errorMsg = formatCardMessage([
            '┃ ❌ *System Error*',
            '┃ ⚠️ *An unexpected error occurred during update.*'
        ]);
        await sock.sendMessage(chatId, { text: errorMsg }, { quoted: message });
    }
}

module.exports = updateCommand;