const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fbdl",
    aliases: ["fbvideo", "fbd"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Download Facebook video",
    category: "media",
    guide: { en: "{p}fbdl <Facebook video link>" }
  },

  onStart: async function ({ message, args }) {
    const url = args[0];
    if (!url || !url.includes("facebook") && !url.includes("fb.watch")) {
      return message.reply("Usage: .fbdl <Facebook video link>");
    }

    try {
      await message.reply("👻 Downloading Facebook video... please wait");

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      let videoUrl = null;

      // Try cobalt.tools
      try {
        const res = await axios.post(
          "https://api.cobalt.tools/api/json",
          { url: url, vQuality: "720" },
          { headers: { "Content-Type": "application/json", "Accept": "application/json" }, timeout: 15000 }
        );
        if (res.data?.url) videoUrl = res.data.url;
      } catch (e) {}

      // Try another API
      if (!videoUrl) {
        try {
          const res2 = await axios.get(
            `https://api.fabdl.com/facebook/get?url=${encodeURIComponent(url)}`,
            { timeout: 12000 }
          );
          if (res2.data?.result?.sd) videoUrl = res2.data.result.sd;
          else if (res2.data?.result?.hd) videoUrl = res2.data.result.hd;
        } catch (e) {}
      }

      if (!videoUrl) return message.reply("❌ Could not download. Make sure the link is public!");

      const filePath = path.join(cacheDir, `fb_${Date.now()}.mp4`);
      const dlRes = await axios({ url: videoUrl, method: "GET", responseType: "stream", timeout: 60000 });
      const writer = fs.createWriteStream(filePath);
      dlRes.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      await message.reply({
        body: `👻 Facebook Video Download\n━━━━━━━━━━━━━━━━\n✅ Downloaded Successfully!\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 15000);
    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
