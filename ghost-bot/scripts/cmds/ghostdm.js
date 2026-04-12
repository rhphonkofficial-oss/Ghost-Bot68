const OWNER_UID = "61576396811594";

module.exports = {
  config: {
    name: "ghostdm",
    aliases: ["dm", "pm", "privatemsg"],
    version: "1.0",
    author: "Rakib Islam",
    role: 2,
    shortDescription: "Send private message to user (Owner only)",
    category: "owner",
    guide: { en: "{p}ghostdm @user <message>" }
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only!");
    const mentioned = Object.keys(event.mentions || {});
    if (!mentioned.length) return message.reply("Tag someone!\n.ghostdm @user Hello!");
    const targetUID = mentioned[0];
    const msg = args.filter(a => !a.startsWith("@")).join(" ").trim();
    if (!msg) return message.reply("Write a message!\n.ghostdm @user Hello there!");
    try {
      await api.sendMessage(
        `👻 Ghost Bot Message\n━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        targetUID
      );
      await message.reply(`✅ Message sent to ${event.mentions[targetUID]}!`);
    } catch (err) {
      message.reply(`❌ Could not send: ${err.message}`);
    }
  }
};
