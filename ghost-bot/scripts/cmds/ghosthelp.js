module.exports = {
  config: {
    name: "ghosthelp",
    aliases: ["gh", "ghelp"],
    version: "1.0",
    author: "Rakib Islam",
    shortDescription: "Ghost Bot custom help menu",
    longDescription: "Shows Ghost Bot's exclusive commands list",
    category: "info",
    guide: {
      en: "{p}ghosthelp"
    },
    usePrefix: true
  },

  onStart: async function ({ message }) {
    await message.reply(`
👻 ━━━━━━━━━━━━━━━━━━━━ 👻
     𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
👻 ━━━━━━━━━━━━━━━━━━━━ 👻

📌 𝗣𝗿𝗲𝗳𝗶𝘅: . (dot)

👻 𝗚𝗛𝗢𝗦𝗧 𝗘𝗫𝗖𝗟𝗨𝗦𝗜𝗩𝗘 𝗖𝗠𝗗𝗦:
┌─────────────────────
│ .owner     — Owner info with photo
│ .alive     — Bot alive check
│ .ghostinfo — Ghost Bot details
│ .ghostping — Check bot speed
│ .ghostquote — Dark quotes
│ .ghostask  — Ask Ghost Bot (AI)
│ .ghosthelp — This help menu
└─────────────────────

💡 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗖𝗠𝗗𝗦:
┌─────────────────────
│ .help      — All commands list
│ .info      — Bot & group info
│ .balance   — Check balance
│ .daily     — Daily reward
│ .game      — Play games
│ .rank      — Check your rank
└─────────────────────

━━━━━━━━━━━━━━━━━━━━
👤 Owner: Rakib Islam
💀 Ghost Bot — Powered by Darkness
    `);
  }
};
