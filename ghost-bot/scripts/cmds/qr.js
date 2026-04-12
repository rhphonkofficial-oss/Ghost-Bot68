const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "qr",
    aliases: ["qrcode", "qrgen"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Generate QR code",
    category: "utility",
    guide: { en: "{p}qr <text or link>\nExample: {p}qr https://facebook.com" }
  },

  onStart: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: .qr <text or link>\nExample: .qr https://facebook.com");

    try {
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff`;
      const filePath = path.join(cacheDir, `qr_${Date.now()}.png`);

      const res = await axios({ url: qrUrl, method: "GET", responseType: "stream", timeout: 10000 });
      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      await message.reply({
        body: `👻 𝗤𝗥 𝗖𝗢𝗗𝗘\n━━━━━━━━━━━━━━━━\n📌 Content: ${text}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 10000);
    } catch (err) {
      message.reply(`❌ QR generation failed: ${err.message}`);
    }
  }
};
