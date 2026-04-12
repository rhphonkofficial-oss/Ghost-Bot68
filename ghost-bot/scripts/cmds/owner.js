const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Show Ghost Bot owner info",
    longDescription: "Shows the owner's profile picture with a beautiful info card",
    category: "info",
    guide: {
      en: "{p}owner"
    },
    usePrefix: true
  },

  onStart: async function ({ message, api }) {
    const ownerUID = "61576396811594";

    const ownerCard = `
╔══════════════════════╗
║   👻  𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 — 𝗢𝗪𝗡𝗘𝗥  👻   ║
╚══════════════════════╝

👤 𝗡𝗮𝗺𝗲  : Rakib Islam
🌙 𝗖𝗹𝗮𝘀𝘀  : Secret
🎂 𝗔𝗴𝗲   : Secret
🌍 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: Dark
🕹️ 𝗛𝗼𝗯𝗯𝘆 : Gaming, Travelling

━━━━━━━━━━━━━━━━━━━━━━
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/${ownerUID}
━━━━━━━━━━━━━━━━━━━━━━

💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿 𝗳𝗼𝗿 𝗵𝗲𝗹𝗽!
👻 Ghost Bot — Powered by Darkness
    `;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const avatarPath = path.join(cacheDir, "owner_avatar.jpg");

    try {
      // Try to fetch Facebook profile picture
      const avatarUrl = `https://graph.facebook.com/${ownerUID}/picture?width=512&height=512&type=large`;
      const response = await axios({
        method: "GET",
        url: avatarUrl,
        responseType: "stream",
        timeout: 10000
      });

      const writer = fs.createWriteStream(avatarPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply({
        body: ownerCard,
        attachment: fs.createReadStream(avatarPath)
      });

      // Clean up
      setTimeout(() => {
        if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
      }, 5000);

    } catch (err) {
      // Fallback without image
      await message.reply({
        body: ownerCard
      });
    }
  }
};
