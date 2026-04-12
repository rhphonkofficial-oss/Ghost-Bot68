const axios = require("axios");

module.exports = {
  config: {
    name: "shorten",
    aliases: ["short", "shorturl", "tinyurl"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Shorten a URL",
    category: "utility",
    guide: { en: "{p}shorten <long url>" }
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    if (!url || !url.startsWith("http")) return message.reply("Usage: .shorten <url>\nExample: .shorten https://very-long-url.com/something");
    try {
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 10000 });
      await message.reply(`👻 𝗨𝗥𝗟 𝗦𝗛𝗢𝗥𝗧𝗘𝗡𝗘𝗥\n━━━━━━━━━━━━━━━━\n🔗 Short: ${res.data}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`);
    } catch (e) {
      message.reply("❌ URL shortening failed. Try again!");
    }
  }
};
