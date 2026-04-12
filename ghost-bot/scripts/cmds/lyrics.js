const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    aliases: ["lyric", "গান"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Get song lyrics",
    category: "music",
    guide: { en: "{p}lyrics <song name>\nExample: {p}lyrics Shape of You" }
  },

  onStart: async function ({ message, args }) {
    const song = args.join(" ").trim();
    if (!song) return message.reply("Usage: .lyrics <song name>\nExample: .lyrics Shape of You");

    try {
      await message.reply(`👻 Searching lyrics for: "${song}"...`);

      const res = await axios.get(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(song)}/`,
        { timeout: 10000 }
      );

      let lyrics = res.data?.lyrics;
      if (!lyrics) {
        // Try another API
        const res2 = await axios.get(
          `https://api.popcat.xyz/lyrics?q=${encodeURIComponent(song)}`,
          { timeout: 10000 }
        );
        lyrics = res2.data?.lyrics;
      }

      if (!lyrics) return message.reply(`❌ Lyrics not found for "${song}". Try exact song name.`);

      // Truncate if too long
      if (lyrics.length > 1500) lyrics = lyrics.substring(0, 1500) + "\n...(truncated)";

      await message.reply(
        `👻 𝗟𝗬𝗥𝗜𝗖𝗦: ${song.toUpperCase()}\n` +
        `━━━━━━━━━━━━━━━━\n${lyrics}\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ Could not find lyrics for "${song}". Try exact song name.`);
    }
  }
};
