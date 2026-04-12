const OWNER_UID = "61576396811594";

module.exports = {
  config: {
    name: "ghostbroadcast",
    aliases: ["broadcast", "announce"],
    version: "1.0",
    author: "Rakib Islam",
    role: 2,
    shortDescription: "Broadcast to all groups (Owner only)",
    category: "owner",
    guide: { en: "{p}ghostbroadcast <message>" }
  },

  onStart: async function ({ api, event, args, message, threadsData }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only!");
    const msg = args.join(" ").trim();
    if (!msg) return message.reply("Write a message to broadcast!");

    try {
      const threads = await threadsData.getAll();
      let sent = 0;
      const announcement = `📢 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧\n━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━\n👤 Owner: Rakib Islam | Ghost Bot`;

      for (const thread of threads.slice(0, 50)) {
        try {
          await api.sendMessage(announcement, thread.threadID);
          sent++;
          await new Promise(r => setTimeout(r, 500)); // delay to prevent spam detection
        } catch (e) {}
      }

      await message.reply(`✅ Broadcast sent to ${sent} threads!\n— Ghost Bot`);
    } catch (err) {
      message.reply(`❌ Broadcast failed: ${err.message}`);
    }
  }
};
