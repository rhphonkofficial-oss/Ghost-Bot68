module.exports = {
  config: {
    name: "ghostinfo",
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Ghost Bot information",
    longDescription: "Shows detailed Ghost Bot information",
    category: "info",
    guide: {
      en: "{p}ghostinfo"
    },
    usePrefix: true
  },

  onStart: async function ({ message }) {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    await message.reply(`
👻 ━━━━━━━━━━━━━━━━━━━━ 👻
        𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
👻 ━━━━━━━━━━━━━━━━━━━━ 👻

🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲  : Ghost Bot
👤 𝗢𝘄𝗻𝗲𝗿    : Rakib Islam
🔧 𝗣𝗿𝗲𝗳𝗶𝘅   : . (dot)
🌍 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲 : Asia/Dhaka
⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲  : ${hours}h ${minutes}m ${seconds}s

💡 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀:
   ✅ 175+ Commands
   ✅ Auto Event Handler
   ✅ Multi-Language Support
   ✅ Admin Panel (Dashboard)
   ✅ Economy System
   ✅ Games & Fun Commands

━━━━━━━━━━━━━━━━━━━━
📌 Type .help to see all commands
💀 Ghost Bot — Powered by Darkness
    `);
  }
};
