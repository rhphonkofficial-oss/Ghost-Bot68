const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["tt", "tik"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Download TikTok video without watermark",
    category: "media",
    guide: { en: "{p}tiktok <link>" }
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    if (!url || !url.includes("tiktok")) return message.reply("Usage: .tiktok <TikTok link>");

    try {
      await message.reply("👻 Downloading TikTok video... please wait");

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      let videoUrl = null;
      let title = "TikTok Video";

      // Try multiple APIs
      try {
        const res = await axios.get(
          `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
          { timeout: 15000 }
        );
        if (res.data?.data?.play) {
          videoUrl = res.data.data.play;
          title = res.data.data.title || title;
        }
      } catch (e) {}

      if (!videoUrl) {
        try {
          const res2 = await axios.post(
            "https://api.cobalt.tools/api/json",
            { url: url },
            { headers: { "Content-Type": "application/json", "Accept": "application/json" }, timeout: 15000 }
          );
          if (res2.data?.url) videoUrl = res2.data.url;
        } catch (e) {}
      }

      if (!videoUrl) return message.reply("❌ Could not download. Make sure the link is public!\n" + url);

      const filePath = path.join(cacheDir, `tiktok_${Date.now()}.mp4`);
      const dlRes = await axios({ url: videoUrl, method: "GET", responseType: "stream", timeout: 60000 });
      const writer = fs.createWriteStream(filePath);
      dlRes.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      await message.reply({
        body: `👻 TikTok Download\n━━━━━━━━━━━━━━━━\n📹 ${title}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 15000);
    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
