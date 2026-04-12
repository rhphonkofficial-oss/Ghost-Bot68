const axios = require("axios");

module.exports = {
  config: {
    name: "define",
    aliases: ["dict", "meaning", "word"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Get word definition",
    category: "utility",
    guide: { en: "{p}define <word>\nExample: {p}define ghost" }
  },

  onStart: async function ({ message, args }) {
    const word = args[0]?.trim();
    if (!word) return message.reply("Usage: .define <word>\nExample: .define ghost");

    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
        { timeout: 10000 }
      );
      const data = res.data?.[0];
      if (!data) return message.reply(`❌ No definition found for "${word}"`);

      const phonetic = data.phonetic || "";
      const meanings = data.meanings?.slice(0, 2).map(m => {
        const def = m.definitions?.[0]?.definition || "";
        const example = m.definitions?.[0]?.example ? `\nExample: "${m.definitions[0].example}"` : "";
        return `📌 ${m.partOfSpeech}: ${def}${example}`;
      }).join("\n\n") || "No definition found";

      await message.reply(
        `👻 𝗗𝗜𝗖𝗧𝗜𝗢𝗡𝗔𝗥𝗬\n━━━━━━━━━━━━━━━━\n` +
        `📖 Word: ${word} ${phonetic}\n\n${meanings}\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ No definition for "${word}". Check spelling!`);
    }
  }
};
