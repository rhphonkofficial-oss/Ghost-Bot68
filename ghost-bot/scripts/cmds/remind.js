module.exports = {
  config: {
    name: "remind",
    aliases: ["reminder", "মনে করিয়ে দাও"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Set a reminder",
    category: "utility",
    guide: { en: "{p}remind <seconds> <message>\nExample: {p}remind 60 Meeting time!" }
  },

  onStart: async function ({ api, message, args, event }) {
    const sec = parseInt(args[0]);
    if (isNaN(sec) || sec < 5 || sec > 86400) return message.reply("Usage: .remind <seconds> <message>\n5 sec to 86400 sec (1 day)\nExample: .remind 60 Meeting!");

    const msg = args.slice(1).join(" ").trim() || "⏰ Time is up!";
    const mins = (sec / 60).toFixed(1);
    const timeStr = sec >= 60 ? `${mins} min` : `${sec} sec`;

    await message.reply(`⏰ Reminder set for ${timeStr}!\n"${msg}"\n— Ghost Bot`);

    setTimeout(() => {
      api.sendMessage(
        `⏰ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥!\n━━━━━━━━━━━━━━━━\n📌 ${msg}\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
        event.threadID
      );
    }, sec * 1000);
  }
};
