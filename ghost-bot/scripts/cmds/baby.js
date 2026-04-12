const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61576396811594";

const autoTeaseLines = [
  "ওরে বাবা! 😳 এখানে কেউ আসছে নাকি?",
  "আরে তুমি? কোথা থেকে এলে? 👀",
  "হুম... কী ব্যাপার? 🤔 কিছু দরকার?",
  "আমি কি কিছু বলেছিলাম? 😏",
  "ওহ হো! কতদিন পর! 😄",
  "ঘুম ভাঙলো নাকি? 😴",
  "ভালো আছো তো? 💙",
  "কী রে, মন খারাপ নাকি? 🌙"
];

module.exports = {
  config: {
    name: "baby",
    aliases: ["bby", "bbe", "babe"],
    version: "4.0",
    author: "Rakib Islam",
    countDown: 2,
    role: 0,
    shortDescription: "Advanced AI chat + auto-tease",
    longDescription: "Chat with Ghost Bot's AI. Auto-tease people who write too much or stay quiet.",
    category: "chat",
    guide: {
      en: "{p}baby <message> — Chat\n{p}baby autotease on/off — Toggle auto-tease mode\n{p}baby tease @user — Tease someone"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const uid = event.senderID;
    const input = args.join(" ").trim();

    if (!input) {
      const ran = autoTeaseLines[Math.floor(Math.random() * autoTeaseLines.length)];
      return message.reply(`👻 ${ran}`);
    }

    // Auto-tease toggle
    if (args[0].toLowerCase() === "autotease") {
      if (uid !== OWNER_UID) return message.reply("👻 Only owner can toggle auto-tease!");
      const toggle = args[1]?.toLowerCase();
      const cfgPath = path.join(__dirname, "../../ghostConfig.json");
      const cfg = JSON.parse(fs.readFileSync(cfgPath));
      cfg.autoTease = toggle === "on";
      fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
      return message.reply(`👻 Auto-tease ${toggle === "on" ? "🟢 ENABLED" : "🔴 DISABLED"}`);
    }

    // Tease a specific person
    if (args[0].toLowerCase() === "tease") {
      const mentioned = Object.keys(event.mentions || {});
      if (!mentioned.length) return message.reply("Tag someone to tease! Example: .baby tease @name");
      const targetName = event.mentions[mentioned[0]];
      const teaseMsg = [
        `${targetName} ভাই/আপু, কী করছেন আজকাল? 👀`,
        `${targetName} সেই দিন কোথায় গিয়েছিলেন? 😏`,
        `${targetName} একটু লাজুক লাজুক লাগছে! 😄`,
        `${targetName} কী ভাবছেন? বলুন বলুন! 🙈`,
        `${targetName} আজকে একটু বেশি চুপ আছেন মনে হচ্ছে... 🌙`
      ];
      return message.reply(teaseMsg[Math.floor(Math.random() * teaseMsg.length)]);
    }

    // AI Chat via multiple fallback APIs
    try {
      let reply = null;

      // Try SimSimi-style or ChatBot API
      try {
        const res = await axios.get(
          `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(input)}&owner=Rakib+Islam&botname=Ghost+Bot`,
          { timeout: 8000 }
        );
        reply = res.data?.response;
      } catch (e) {}

      // Fallback: DialoGPT
      if (!reply) {
        try {
          const res2 = await axios.get(
            `https://api.yodaroi.com/chatbot?msg=${encodeURIComponent(input)}`,
            { timeout: 8000 }
          );
          reply = res2.data?.message || res2.data?.reply;
        } catch (e) {}
      }

      // Fallback: custom responses
      if (!reply) {
        const responses = [
          "হুম! বুঝলাম। কিন্তু আরো বলো! 😊",
          "আচ্ছা আচ্ছা! 🤔 সেটা তো ঠিকই বলেছো।",
          "সত্যিই? এটা তো জানতাম না! 😮",
          "হাহাহা! 😂 এটা মজার ছিল।",
          "আমি বুঝি তোমাকে! 💙 চালিয়ে যাও।"
        ];
        reply = responses[Math.floor(Math.random() * responses.length)];
      }

      return message.reply(`👻 Ghost Bot: ${reply}`);
    } catch (err) {
      return message.reply("👻 Ghost Bot ব্যস্ত আছি একটু! আবার try করো। 😅");
    }
  },

  onChat: async function ({ event, message, api }) {
    try {
      const cfgPath = path.join(__dirname, "../../ghostConfig.json");
      const cfg = JSON.parse(fs.readFileSync(cfgPath));
      if (!cfg.autoTease) return;

      const text = event.body?.trim();
      if (!text || text.startsWith(".")) return;

      // Auto-tease if message is very long (>200 chars)
      if (text.length > 200 && Math.random() > 0.7) {
        const teases = [
          "এতো বড় message! একটু ছোট করে লিখলে কি হয়? 😄",
          "ওরে বাবা! এতো কিছু লিখলে? 😱",
          "এতো বড় essay কেন? 📚 সারাংশ দাও!"
        ];
        return message.reply(teases[Math.floor(Math.random() * teases.length)]);
      }
    } catch (e) {}
  }
};
