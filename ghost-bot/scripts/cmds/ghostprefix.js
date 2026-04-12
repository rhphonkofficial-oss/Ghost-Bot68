module.exports = {
  config: {
    name: "ghostprefix",
    aliases: ["prefix", "setprefix", "changeprefix"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 1,
    shortDescription: "Change bot prefix (Admin only)",
    longDescription: "এই group-এর prefix পরিবর্তন করুন। Owner গ্লোবাল prefix পরিবর্তন করতে পারবে।",
    category: "admin",
    guide: {
      en: [
        "{p}ghostprefix <new_prefix> — Change prefix for this group",
        "{p}ghostprefix global <new_prefix> — Change global prefix (Owner only)",
        "{p}ghostprefix reset — Reset group prefix to global",
        "{p}ghostprefix check — See current prefix"
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, message, threadsData }) {
    const OWNER_UID = "61576396811594";
    const fs = require("fs-extra");
    const path = require("path");
    const configPath = path.join(__dirname, "../../config.json");
    const { getPrefix } = global.utils;

    const currentPrefix = getPrefix(event.threadID);
    const action = args[0]?.toLowerCase();

    // ── Check current prefix ──
    if (!action || action === "check") {
      const threadData = global.db.allThreadData.find(t => String(t.threadID) === String(event.threadID));
      const groupPrefix = threadData?.data?.prefix || null;
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

      return message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫\n━━━━━━━━━━━━━━━━\n` +
        `📌 এই Group: ${groupPrefix || "(Global দিয়ে চলছে)"}\n` +
        `🌍 Global: ${config.prefix || "."}\n` +
        `⚡ এখন Active: ${currentPrefix}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📝 Example: ${currentPrefix}help | ${currentPrefix}song\n` +
        `— Rakib Islam | Ghost Bot`
      );
    }

    // ── Reset to global prefix ──
    if (action === "reset") {
      const threadData = global.db.allThreadData.find(t => String(t.threadID) === String(event.threadID));
      if (threadData?.data) {
        delete threadData.data.prefix;
        await threadsData.set(event.threadID, threadData.data);
      }
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return message.reply(
        `✅ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗥𝗘𝗦𝗘𝗧!\n━━━━━━━━━━━━━━━━\n` +
        `📌 Global prefix-এ ফিরে গেছে: ${config.prefix || "."}\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    }

    // ── Change global prefix (Owner only) ──
    if (action === "global") {
      if (event.senderID !== OWNER_UID) {
        return message.reply("❌ শুধু Owner গ্লোবাল prefix পরিবর্তন করতে পারবে!\n— Ghost Bot");
      }
      const newPrefix = args[1];
      if (!newPrefix) return message.reply("Usage: .ghostprefix global <new_prefix>\nExample: .ghostprefix global !");
      if (newPrefix.length > 5) return message.reply("❌ Prefix সর্বোচ্চ ৫ character হতে পারবে!");

      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const oldPrefix = config.prefix;
      config.prefix = newPrefix;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      // Update in-memory immediately
      if (global.GoatBot?.config) global.GoatBot.config.prefix = newPrefix;

      return message.reply(
        `✅ 𝗚𝗟𝗢𝗕𝗔𝗟 𝗣𝗥𝗘𝗙𝗜𝗫 𝗖𝗛𝗔𝗡𝗚𝗘𝗗!\n━━━━━━━━━━━━━━━━\n` +
        `🔄 পুরনো: ${oldPrefix}\n` +
        `✨ নতুন: ${newPrefix}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📝 এখন: ${newPrefix}help | ${newPrefix}song\n` +
        `⚠️ Restart করলে সব group-এ সম্পূর্ণ apply হবে\n` +
        `— Rakib Islam | Ghost Bot`
      );
    }

    // ── Change this group's prefix ──
    const newPrefix = args[0];
    if (newPrefix.length > 5) return message.reply("❌ Prefix সর্বোচ্চ ৫ character হতে পারবে!");
    if (/\s/.test(newPrefix)) return message.reply("❌ Prefix-এ space দেওয়া যাবে না!");

    try {
      const threadData = global.db.allThreadData.find(t => String(t.threadID) === String(event.threadID));
      if (threadData?.data) {
        threadData.data.prefix = newPrefix;
        await threadsData.set(event.threadID, threadData.data);
      }

      await message.reply(
        `✅ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗖𝗛𝗔𝗡𝗚𝗘𝗗!\n━━━━━━━━━━━━━━━━\n` +
        `📌 শুধু এই Group-এর জন্য পরিবর্তিত\n` +
        `🔄 পুরনো Prefix: ${currentPrefix}\n` +
        `✨ নতুন Prefix: ${newPrefix}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📝 এখন থেকে: ${newPrefix}help | ${newPrefix}song | ${newPrefix}gpt\n` +
        `💡 Reset করতে: ${newPrefix}ghostprefix reset\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ Prefix পরিবর্তন করা যায়নি: ${err.message}\n— Ghost Bot`);
    }
  }
};
