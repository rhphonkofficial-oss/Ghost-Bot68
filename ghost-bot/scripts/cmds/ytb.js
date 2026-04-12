const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61576396811594";

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube", "yt"],
    version: "3.0",
    author: "Rakib Islam",
    countDown: 10,
    role: 0,
    shortDescription: "YouTube MP3/MP4 downloader",
    longDescription: "Download audio (mp3) or video (mp4) from YouTube",
    category: "media",
    guide: {
      en: "{p}ytb mp3 <song name or link>\n{p}ytb mp4 <video name or link>\n{p}ytb info <video link>\n\nExample:\n{p}ytb mp3 Shape of You\n{p}ytb mp4 Funny cats"
    }
  },

  onStart: async function ({ api, args, event, message, commandName }) {
    if (!args[0]) return message.reply("Usage:\n.ytb mp3 <song name>\n.ytb mp4 <video name>\n.ytb info <link>");

    const action = args[0].toLowerCase();
    args.shift();
    const query = args.join(" ").trim();

    if (!query) return message.reply(`Please provide a song/video name after '${action}'`);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      await message.reply(`👻 Ghost Bot searching for: "${query}"\nPlease wait...`);

      // Search YouTube
      const searchRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY`,
        { timeout: 10000 }
      ).catch(() => null);

      let videoId, title, thumbnail;

      if (searchRes?.data?.items?.[0]) {
        const item = searchRes.data.items[0];
        videoId = item.id.videoId;
        title = item.snippet.title;
        thumbnail = item.snippet.thumbnails?.high?.url;
      } else {
        // fallback: use scraping API
        const ytSearch = await axios.get(
          `https://api.popcat.xyz/youtube/search?q=${encodeURIComponent(query)}`,
          { timeout: 10000 }
        );
        if (!ytSearch.data?.[0]) return message.reply("❌ No results found. Try a different search.");
        const vid = ytSearch.data[0];
        videoId = vid.id;
        title = vid.title;
        thumbnail = vid.thumbnail;
      }

      const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (action === "info") {
        return message.reply(`
🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗩𝗜𝗗𝗘𝗢 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━
📌 Title: ${title}
🔗 Link: ${ytUrl}
━━━━━━━━━━━━━━━━
— Ghost Bot by Rakib Islam`);
      }

      const format = (action === "mp3" || action === "audio" || action === "-a") ? "mp3" : "mp4";
      const filePath = path.join(cacheDir, `ghost_ytb_${Date.now()}.${format}`);

      // Try multiple download APIs
      const dlApis = [
        `https://api.vevioz.com/api/button/${format}/${videoId}`,
        `https://yt-download.org/api/button/${format}/${videoId}`,
        `https://loader.to/api/button/?url=${encodeURIComponent(ytUrl)}&f=${format}`
      ];

      let dlUrl = null;

      // Use y2mate-like approach via rapidapi
      try {
        const dlRes = await axios.get(
          `https://api.fabdl.com/youtube/get?url=${encodeURIComponent(ytUrl)}`,
          { timeout: 15000 }
        );
        if (dlRes.data?.result?.download_url) {
          dlUrl = dlRes.data.result.download_url;
        }
      } catch (e) {}

      // Alternative: use cobalt.tools API
      if (!dlUrl) {
        try {
          const cobaltRes = await axios.post(
            "https://api.cobalt.tools/api/json",
            { url: ytUrl, isAudioOnly: format === "mp3", aFormat: "mp3" },
            {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              timeout: 15000
            }
          );
          if (cobaltRes.data?.url) dlUrl = cobaltRes.data.url;
        } catch (e) {}
      }

      if (!dlUrl) {
        return message.reply(`
👻 Ghost Bot found: "${title}"
🔗 ${ytUrl}

⚠️ Direct download not available right now.
👉 Use this link to download manually!
— Ghost Bot by Rakib Islam`);
      }

      // Download the file
      const fileRes = await axios({
        url: dlUrl,
        method: "GET",
        responseType: "stream",
        timeout: 60000
      });

      const writer = fs.createWriteStream(filePath);
      fileRes.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await message.reply({
        body: `👻 Ghost Bot — ${format.toUpperCase()} Download\n━━━━━━━━━━━━━━━━\n🎵 ${title}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch (e) {} }, 10000);

    } catch (err) {
      message.reply(`❌ Error: ${err.message}\nTry: .ytb mp3 <song name>`);
    }
  }
};
