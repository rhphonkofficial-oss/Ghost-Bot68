module.exports = {
  config: {
    name: "alive",
    version: "2.0",
    author: "Rakib Islam",
    shortDescription: "Ghost Bot alive check",
    longDescription: "Replies with Ghost Bot status",
    category: "alive",
    guide: {
      en: "Type: alive or .alive"
    },
    usePrefix: false,
    onChat: true
  },

  onStart: async ({ message }) => sendAlive(message),

  onChat: async ({ event, message }) => {
    const text = event.body?.toLowerCase().trim();
    if (text === "alive" || text === ".alive") {
      await sendAlive(message);
    }
  }
};

async function sendAlive(message) {
  try {
    await message.reply({
      body: `
👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 👻
━━━━━━━━━━━━━━━━━━━━
✅ Bot is Online & Active!

👤 Owner: Rakib Islam
🔧 Prefix: . (dot)
⚡ Status: Running Smoothly
🌙 Class: Secret
🕹️ Hobby: Gaming & Travelling
━━━━━━━━━━━━━━━━━━━━
💀 Ghost Bot — Powered by Darkness
      `
    });
  } catch (err) {
    console.error("Alive error:", err);
  }
}
