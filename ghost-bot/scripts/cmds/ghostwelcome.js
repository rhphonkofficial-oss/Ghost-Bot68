module.exports = {
  config: {
    name: "ghostwelcome",
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Ghost Bot welcome message",
    longDescription: "Toggle welcome messages for new group members",
    category: "group",
    guide: {
      en: "{p}ghostwelcome on/off"
    },
    usePrefix: true,
    role: 1
  },

  onStart: async function ({ message, args, threadsData, threadID }) {
    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      return message.reply("Usage: .ghostwelcome on/off");
    }

    const enable = args[0].toLowerCase() === "on";

    await threadsData.set(threadID, enable, "data.ghostwelcome");

    await message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗪𝗘𝗟𝗖𝗢𝗠𝗘
━━━━━━━━━━━━━━━━
✅ Welcome messages: ${enable ? "ENABLED" : "DISABLED"}
━━━━━━━━━━━━━━━━
— Ghost Bot by Rakib Islam
    `);
  }
};
