const axios = require("axios");

const banglaJokes = [
  "একজন মানুষ ডাক্তারের কাছে গেল।\nডাক্তার: কী সমস্যা?\nলোক: আমি নিজেকে কুকুর মনে করি।\nডাক্তার: কবে থেকে?\nলোক: ছোটবেলা থেকে। কুচকুচে কালো ছিলাম তো! 🐕😂",
  "শিক্ষক: তোমার বাবা কী করেন?\nছাত্র: বাবা ঘুমান স্যার।\nশিক্ষক: না না, পেশা কী?\nছাত্র: Professional ঘুমানো। রাতেও ঘুমান, দিনেও ঘুমান! 😴😂",
  "বস: তুমি কেন সবসময় দেরি করো?\nকর্মী: কারণ আপনি বলেছিলেন — সকালে তাড়াহুড়া করো না। 😏",
  "বন্ধু: তুই এত টাকা কোথায় পেলি?\nআমি: ATM-এ গিয়েছিলাম।\nবন্ধু: তাই বলে কি পুরো ATM-ই নিয়ে এলি? 🏧😂",
  "মা: কোথায় যাচ্ছিস?\nছেলে: পড়তে।\nমা: এই রাত ১২টায়?\nছেলে: একটু দেরিতে শুরু করবো। 📚😅",
  "ডাক্তার: তুমি ৩ মাস বাঁচবে।\nরোগী: এটা শুনে মন খারাপ হলো।\nডাক্তার: কিন্তু তুমি এখন হাসছো কেন?\nরোগী: কারণ আপনার বিল দেওয়ার আগেই শেষ! 😂💀",
  "মেয়ে: তুমি আমাকে কতটা ভালোবাসো?\nছেলে: চাঁদের মতো।\nমেয়ে: মানে?\nছেলে: দেখি, কিন্তু কাছে যাওয়া হয় না। 🌙😂",
  "পরীক্ষায় প্রশ্ন: 'আলো কীভাবে ভ্রমণ করে?'\nছাত্র: সাইকেলে না। বিমানে। কারণ এটা দ্রুততম! ✈️😂"
];

module.exports = {
  config: {
    name: "joke",
    aliases: ["jokes", "হাসি", "fun"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Random funny joke",
    category: "fun",
    guide: { en: "{p}joke — Get a random joke" }
  },

  onStart: async function ({ message }) {
    try {
      let jokeText = banglaJokes[Math.floor(Math.random() * banglaJokes.length)];

      // Try English jokes from API
      try {
        const res = await axios.get("https://official-joke-api.appspot.com/random_joke", { timeout: 5000 });
        if (res.data?.setup) {
          jokeText = `😂 ${res.data.setup}\n\n👉 ${res.data.punchline}`;
        }
      } catch (e) {}

      await message.reply(`👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗝𝗢𝗞𝗘\n━━━━━━━━━━━━━━━━\n${jokeText}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`);
    } catch (err) {
      message.reply("👻 এখন joke মুড-এ নেই! পরে try করো 😅");
    }
  }
};
