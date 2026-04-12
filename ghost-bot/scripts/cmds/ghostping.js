module.exports = {
  config: {
    name: "ghostping",
    aliases: ["gping", "ping"],
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Check Ghost Bot ping",
    longDescription: "Shows Ghost Bot response time",
    category: "info",
    guide: {
      en: "{p}ghostping"
    },
    usePrefix: true
  },

  onStart: async function ({ message }) {
    const start = Date.now();
    const msg = await message.reply("👻 Checking Ghost Bot ping...");
    const ping = Date.now() - start;

    await message.unsend(msg.messageID);

    await message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗣𝗜𝗡𝗚
━━━━━━━━━━━━━━━━
⚡ Response : ${ping}ms
✅ Status   : Online
💀 Ghost Bot — Powered by Darkness
    `);
  }
};
