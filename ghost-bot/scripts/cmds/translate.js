const axios = require("axios");

module.exports = {
  config: {
    name: "translate",
    aliases: ["tr", "অনুবাদ"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 3,
    role: 0,
    shortDescription: "Translate text to any language",
    category: "utility",
    guide: { en: "{p}translate <lang code> <text>\nExample: {p}translate bn Hello World\nCodes: bn=Bengali, en=English, ar=Arabic, hi=Hindi" }
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) return message.reply("Usage: .translate <lang> <text>\nExample: .translate bn Hello World\n\nLanguage codes:\nbn = Bengali\nen = English\nhi = Hindi\nar = Arabic\nfr = French\nde = German\nzh = Chinese\nja = Japanese\nko = Korean");

    const to = args[0].toLowerCase();
    const text = args.slice(1).join(" ");

    try {
      const res = await axios.get(
        `https://api.popcat.xyz/translate?to=${to}&text=${encodeURIComponent(text)}`,
        { timeout: 10000 }
      );
      const translated = res.data?.translated;
      if (!translated) throw new Error("No translation");

      await message.reply(
        `👻 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗘\n━━━━━━━━━━━━━━━━\n` +
        `📝 Original: ${text}\n🌍 Language: ${to}\n💬 Translated: ${translated}\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      // Fallback to Google Translate unofficial
      try {
        const res2 = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
          { timeout: 10000 }
        );
        const translated = res2.data?.[0]?.[0]?.[0];
        if (!translated) return message.reply("❌ Translation failed. Try again!");
        await message.reply(
          `👻 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗘\n━━━━━━━━━━━━━━━━\n` +
          `📝 Original: ${text}\n🌍 Language: ${to}\n💬 Translated: ${translated}\n` +
          `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
        );
      } catch (e) {
        message.reply("❌ Translation failed! Check language code.\nExample: .translate bn Hello");
      }
    }
  }
};
