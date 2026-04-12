const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "song",
    aliases: ["music", "mp3", "গান"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: "Download any song as MP3",
    category: "media",
    guide: { en: "{p}song <song name>\nExample: {p}song Shape of You" }
  },

  onStart: async function ({ event, api, args, message }) {
    const query = args.join(" ").trim();
    if (!query) return message.reply("Usage: .song <name>\nExample: .song Shape of You");

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    await message.reply(`👻 Ghost Bot searching: "${query}"\n🎵 Please wait...`);
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      let audioUrl = null;
      let title = query;

      // Try saavncdn (JioSaavn API)
      try {
        const searchRes = await axios.get(
          `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&page=1&limit=3`,
          { timeout: 10000 }
        );
        const song = searchRes.data?.data?.results?.[0];
        if (song?.downloadUrl?.length) {
          const urls = song.downloadUrl;
          audioUrl = urls.find(u => u.quality === "320kbps")?.url || urls[urls.length - 1]?.url;
          title = song.name || query;
        }
      } catch (e) {}

      // Fallback: YouTube audio via @distube/ytdl-core
      if (!audioUrl) {
        try {
          const ytSearch = await axios.get(
            `https://api.popcat.xyz/youtube/search?q=${encodeURIComponent(query + " audio")}`,
            { timeout: 10000 }
          );
          const ytVideo = ytSearch.data?.[0];
          if (ytVideo?.id) {
            const cobaltRes = await axios.post(
              "https://api.cobalt.tools/api/json",
              { url: `https://www.youtube.com/watch?v=${ytVideo.id}`, isAudioOnly: true, aFormat: "mp3" },
              { headers: { "Content-Type": "application/json", "Accept": "application/json" }, timeout: 20000 }
            );
            if (cobaltRes.data?.url) {
              audioUrl = cobaltRes.data.url;
              title = ytVideo.title || query;
            }
          }
        } catch (e) {}
      }

      if (!audioUrl) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`❌ Could not find "${query}". Try:\n.ytb mp3 ${query}`);
      }

      const filePath = path.join(cacheDir, `song_${Date.now()}.mp3`);
      const dlRes = await axios({ url: audioUrl, method: "GET", responseType: "stream", timeout: 60000 });
      const writer = fs.createWriteStream(filePath);
      dlRes.data.pipe(writer);
      await new Promise((r, j) => { writer.on("finish", r); writer.on("error", j); });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗠𝗨𝗦𝗜𝗖\n━━━━━━━━━━━━━━━━\n🎵 ${title}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 15000);
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
