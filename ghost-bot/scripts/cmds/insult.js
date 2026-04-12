module.exports = {
  config: {
    name: "insult",
    aliases: ["shame", "expose"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    countDown: 5,
    shortDescription: "Expose/shame a bad user (Admin only)",
    longDescription: "Publicly call out bad behavior. Admin/Owner only.",
    category: "admin",
    guide: { en: "{p}insult @user <reason>\nExample: {p}insult @user spam korche" }
  },

  onStart: async function ({ api, event, args, message }) {
    const mentioned = Object.keys(event.mentions || {});
    if (!mentioned.length) return message.reply("Tag someone!\nExample: .insult @name spam করেছে");

    const targetUID = mentioned[0];
    const targetName = event.mentions[targetUID];
    const reason = args.filter(a => !a.startsWith("@")).join(" ").trim() || "গ্রুপে বিশৃঙ্খলা তৈরি করা";

    const shameMessages = [
      `⚠️ ATTENTION! @${targetName} কে সবাই সাবধান থাকো!`,
      `🚨 WARNING! এই ব্যক্তি গ্রুপের জন্য সমস্যা।`,
      `🔴 ALERT! Admin সতর্কতা জারি করেছেন।`,
      `⛔ NOTICE! এই আচরণ গ্রুপে সহ্য করা হবে না।`
    ];

    const header = shameMessages[Math.floor(Math.random() * shameMessages.length)];

    await message.reply(
      `${header}\n\n` +
      `👤 User: ${targetName}\n` +
      `❌ কারণ: ${reason}\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `⚠️ Admin নোটিশ: এই ধরনের আচরণ ভবিষ্যতে করলে kick করা হবে।\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `— Rakib Islam | Ghost Bot Admin`
    );

    await api.setMessageReaction("⚠️", event.messageID, () => {}, true);
  }
};
