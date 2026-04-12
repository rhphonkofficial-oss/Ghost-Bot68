module.exports = {
  config: {
    name: "ship",
    aliases: ["love", "couple"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Ship two people with love %",
    category: "fun",
    guide: { en: "{p}ship @person1 @person2" }
  },

  onStart: async function ({ message, event }) {
    const mentioned = Object.keys(event.mentions || {});
    if (mentioned.length < 2) return message.reply("Tag 2 people!\nExample: .ship @person1 @person2");

    const name1 = event.mentions[mentioned[0]];
    const name2 = event.mentions[mentioned[1]];
    const pct = Math.floor(Math.random() * 101);

    let emoji, comment;
    if (pct < 20) { emoji = "💔"; comment = "Not a good match..."; }
    else if (pct < 40) { emoji = "❤️"; comment = "Maybe one day!"; }
    else if (pct < 60) { emoji = "💕"; comment = "There's something here!"; }
    else if (pct < 80) { emoji = "💞"; comment = "Great match!"; }
    else { emoji = "💘"; comment = "Perfect soulmates! 😍"; }

    const bar = "❤️".repeat(Math.floor(pct / 10)) + "🖤".repeat(10 - Math.floor(pct / 10));

    await message.reply(
      `👻 𝗦𝗛𝗜𝗣 𝗠𝗘𝗧𝗘𝗥\n━━━━━━━━━━━━━━━━\n` +
      `👤 ${name1}\n${emoji} + ${emoji}\n👤 ${name2}\n\n` +
      `${bar}\n💯 Love: ${pct}%\n💬 "${comment}"\n` +
      `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );
  }
};
