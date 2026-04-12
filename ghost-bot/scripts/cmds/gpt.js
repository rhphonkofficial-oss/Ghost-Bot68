const axios = require("axios");

module.exports = {
  config: {
    name: "gpt",
    aliases: ["ai", "ghostai", "ask2"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "AI powered chat (GPT)",
    category: "ai",
    guide: { en: "{p}gpt <your question>\nExample: {p}gpt বাংলাদেশের রাজধানী কী?" }
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ").trim();
    if (!query) return message.reply("Usage: .gpt <question>\nExample: .gpt What is AI?");

    try {
      await message.reply("👻 Ghost AI thinking... 🤔");

      let answer = null;

      // Try pollinations.ai (free, no API key)
      try {
        const res = await axios.get(
          `https://text.pollinations.ai/${encodeURIComponent(query)}?model=mistral&system=You+are+Ghost+Bot+AI,+a+helpful+assistant+created+by+Rakib+Islam`,
          { timeout: 15000 }
        );
        if (res.data && typeof res.data === "string" && res.data.length > 5) {
          answer = res.data;
        }
      } catch (e) {}

      // Fallback: use another free AI
      if (!answer) {
        try {
          const res2 = await axios.post(
            "https://api.deepinfra.com/v1/openai/chat/completions",
            {
              model: "meta-llama/Llama-2-70b-chat-hf",
              messages: [
                { role: "system", content: "You are Ghost Bot, a helpful assistant made by Rakib Islam." },
                { role: "user", content: query }
              ]
            },
            { headers: { "Content-Type": "application/json" }, timeout: 15000 }
          );
          answer = res2.data?.choices?.[0]?.message?.content;
        } catch (e) {}
      }

      // Fallback
      if (!answer) {
        try {
          const res3 = await axios.get(
            `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(query)}&owner=Rakib+Islam&botname=Ghost+Bot`,
            { timeout: 8000 }
          );
          answer = res3.data?.response;
        } catch (e) {}
      }

      if (!answer) return message.reply("👻 Ghost AI is busy right now. Try again in a moment!");

      await message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗔𝗜\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `❓ Q: ${query}\n\n` +
        `💬 A: ${answer}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ Error: ${err.message}`);
    }
  }
};
