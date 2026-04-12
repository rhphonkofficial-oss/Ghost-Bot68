module.exports = {
  config: {
    name: "ghostquote",
    aliases: ["quote", "gquote"],
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Random dark quotes by Ghost Bot",
    longDescription: "Sends a random dark/motivational quote",
    category: "fun",
    guide: {
      en: "{p}ghostquote"
    },
    usePrefix: true
  },

  onStart: async function ({ message }) {
    const quotes = [
      "In the darkest night, even a ghost finds its way. 👻",
      "Silence is louder than words when you live in the shadows. 🌙",
      "The strongest people are those who fight battles others know nothing about. 💪",
      "Not all who wander are lost. Some are just... haunting. 👻",
      "Darkness is not the absence of light, it's the presence of power. ⚡",
      "Born in the dark, living in the shadows, feared by many. 💀",
      "The ghost doesn't ask permission to haunt. Neither should you. 👻",
      "Pain is temporary. Being a legend is forever. 🔥",
      "Even in darkness, I burn bright enough to blind. ✨",
      "The darker the night, the brighter your ghost shines. 👻"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    await message.reply(`
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗤𝗨𝗢𝗧𝗘
━━━━━━━━━━━━━━━━

💬 "${randomQuote}"

━━━━━━━━━━━━━━━━
— Rakib Islam | Ghost Bot
    `);
  }
};
