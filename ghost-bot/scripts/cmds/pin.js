const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pinterest"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "Search Pinterest images",
    longDescription: "Search and download images from Pinterest",
    category: "image",
    guide: { en: "{p}pin <search query> - <count>\nExample: {p}pin anime girl - 5" }
  },

  onStart: async function ({ api, event, args, message }) {
    const input = args.join(" ");
    const parts = input.split("-");
    const query = parts[0]?.trim();
    const count = Math.min(parseInt(parts[1]?.trim()) || 4, 10);

    if (!query) return message.reply("Usage: .pin <search> - <count>\nExample: .pin anime girl - 5");

    try {
      await message.reply(`👻 Searching Pinterest for: "${query}"\nFetching ${count} images...`);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      // Use working Pinterest APIs
      let images = [];

      try {
        const res = await axios.get(
          `https://api.pinterestapi.co.uk/board_feed/?url=https://pinterest.com/search/pins/?q=${encodeURIComponent(query)}&count=${count}`,
          { timeout: 12000 }
        );
        if (res.data?.body) {
          images = res.data.body
            .filter(p => p?.images?.orig?.url)
            .map(p => p.images.orig.url)
            .slice(0, count);
        }
      } catch (e) {}

      // Fallback: use alternate Pinterest scraper
      if (images.length === 0) {
        try {
          const res2 = await axios.get(
            `https://api.yodaroi.com/pinterest?query=${encodeURIComponent(query)}&count=${count}`,
            { timeout: 12000 }
          );
          images = (res2.data?.images || res2.data || []).slice(0, count);
        } catch (e) {}
      }

      // Fallback: use DuckDuckGo image search
      if (images.length === 0) {
        try {
          const ddg = await axios.get(
            `https://api.popcat.xyz/pinterest?q=${encodeURIComponent(query)}`,
            { timeout: 10000 }
          );
          images = (ddg.data?.results || []).slice(0, count).map(r => r.media || r.url || r);
        } catch (e) {}
      }

      if (images.length === 0) {
        return message.reply(`❌ No images found for "${query}". Try a different search term.`);
      }

      const attachments = [];
      for (let i = 0; i < Math.min(images.length, count); i++) {
        try {
          const imgPath = path.join(cacheDir, `pin_${Date.now()}_${i}.jpg`);
          const imgRes = await axios({
            url: images[i],
            method: "GET",
            responseType: "stream",
            timeout: 10000
          });
          const writer = fs.createWriteStream(imgPath);
          imgRes.data.pipe(writer);
          await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });
          attachments.push({ stream: fs.createReadStream(imgPath), path: imgPath });
        } catch (e) {}
      }

      if (attachments.length === 0) {
        return message.reply(`❌ Could not download images. Try again!`);
      }

      await message.reply({
        body: `👻 Pinterest Results: "${query}"\n📸 Found ${attachments.length} images\n— Rakib Islam | Ghost Bot`,
        attachment: attachments.map(a => a.stream)
      });

      setTimeout(() => {
        attachments.forEach(a => { try { fs.unlinkSync(a.path); } catch (e) {} });
      }, 10000);

    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
