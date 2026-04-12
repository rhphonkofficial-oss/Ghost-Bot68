const axios = require("axios");

module.exports = {
  config: {
    name: "ghostask",
    aliases: ["ask", "gask"],
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Ask Ghost Bot anything",
    longDescription: "Ask Ghost Bot any question and it will answer",
    category: "ai",
    guide: {
      en: "{p}ghostask <your question>"
    },
    usePrefix: true
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) {
      return message.reply("👻 Please provide a question!\nUsage: .ghostask <your question>");
    }

    const question = args.join(" ");

    try {
      await message.reply("👻 Ghost Bot is thinking...");

      const response = await axios.get(`https://api.popcat.xyz/chatbot`, {
        params: {
          msg: question,
          owner: "Rakib Islam",
          botname: "Ghost Bot"
        },
        timeout: 10000
      });

      const answer = response.data?.response || "I couldn't find an answer right now. Try again!";

      await message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗔𝗡𝗦𝗪𝗘𝗥
━━━━━━━━━━━━━━━━
❓ Q: ${question}
💬 A: ${answer}
━━━━━━━━━━━━━━━━
— Ghost Bot by Rakib Islam
      `);
    } catch (err) {
      await message.reply("👻 Ghost Bot couldn't answer right now. Please try again!");
    }
  }
};
