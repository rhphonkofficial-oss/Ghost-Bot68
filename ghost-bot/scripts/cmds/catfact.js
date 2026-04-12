const axios = require("axios");

const banglaFacts = [
  "বিড়াল দিনে ১২-১৬ ঘন্টা ঘুমায়! 😴",
  "বিড়ালের ৩২টি কান পেশি আছে! 👂",
  "বিড়াল শুধু মানুষের সাথে meow করে। 😸",
  "বিড়াল তাদের শরীরের দৈর্ঘ্যের ৬ গুণ লাফ দিতে পারে! 🐱",
  "বিড়াল অন্ধকারে মানুষের চেয়ে ৬ গুণ ভালো দেখে। 👀"
];

module.exports = {
  config: {
    name: "catfact",
    aliases: ["cat", "বিড়াল"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Random cat fact",
    category: "fun",
    guide: { en: "{p}catfact" }
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get("https://catfact.ninja/fact", { timeout: 8000 });
      const fact = res.data?.fact || banglaFacts[Math.floor(Math.random() * banglaFacts.length)];
      await message.reply(`🐱 𝗖𝗔𝗧 𝗙𝗔𝗖𝗧\n━━━━━━━━━━━━━━━━\n${fact}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`);
    } catch (e) {
      message.reply(`🐱 Cat Fact: ${banglaFacts[Math.floor(Math.random() * banglaFacts.length)]}`);
    }
  }
};
