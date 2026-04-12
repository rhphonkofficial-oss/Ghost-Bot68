module.exports = {
  config: {
    name: "ghosttag",
    aliases: ["tagall", "tageveryone"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    shortDescription: "Tag all members (Admin only)",
    category: "admin",
    guide: { en: "{p}ghosttag <message>\nExample: {p}ghosttag Meeting in 5 minutes!" }
  },

  onStart: async function ({ api, event, message, args }) {
    const msg = args.join(" ").trim() || "Everyone please read this!";
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs || [];
      if (members.length === 0) return message.reply("No members found!");

      const mentions = members.map(uid => ({ tag: `@member`, id: uid }));
      const tagText = members.map(() => "@member").join(" ");

      await api.sendMessage({
        body: `📢 ${msg}\n\n${tagText}\n\n— Rakib Islam | Ghost Bot`,
        mentions
      }, event.threadID);
    } catch (err) {
      message.reply(`❌ Could not tag all: ${err.message}\n(Bot needs admin permission)`);
    }
  }
};
