const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    aliases: ["img2", "draw", "generate"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: "AI image generation",
    category: "ai",
    guide: { en: "{p}imagine <prompt>\nExample: {p}imagine anime ghost warrior in dark forest" }
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ").trim();
    if (!prompt) return message.reply("Usage: .imagine <prompt>\nExample: .imagine anime ghost warrior");

    try {
      await message.reply(`👻 Ghost AI generating image...\nPrompt: "${prompt}"\nPlease wait 10-20 seconds...`);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const seed = Math.floor(Math.random() * 999999);
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=512&height=512&nologo=true`;

      const filePath = path.join(cacheDir, `imagine_${Date.now()}.jpg`);
      const imgRes = await axios({
        url: imgUrl,
        method: "GET",
        responseType: "stream",
        timeout: 60000
      });

      const writer = fs.createWriteStream(filePath);
      imgRes.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      await message.reply({
        body: `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗜 𝗜𝗠𝗔𝗚𝗘\n━━━━━━━━━━━━━━━━\n🎨 Prompt: ${prompt}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 15000);
    } catch (err) {
      message.reply(`❌ Image generation failed: ${err.message}\nTry again!`);
    }
  }
};
