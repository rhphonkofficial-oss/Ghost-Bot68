module.exports = {
  config: {
    name: "ghoststats",
    aliases: ["stats", "botstats"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Ghost Bot statistics",
    category: "info",
    guide: { en: "{p}ghoststats" }
  },

  onStart: async function ({ message, api }) {
    try {
      const uptimeSec = process.uptime();
      const h = Math.floor(uptimeSec / 3600);
      const m = Math.floor((uptimeSec % 3600) / 60);
      const s = Math.floor(uptimeSec % 60);

      const mem = process.memoryUsage();
      const memMB = (mem.rss / 1024 / 1024).toFixed(1);
      const heapMB = (mem.heapUsed / 1024 / 1024).toFixed(1);

      const threads = await api.getThreadList(1, null, ["INBOX"]).catch(() => []);
      const threadCount = threads?.length || "N/A";

      await message.reply(
        `👻 𝗚𝗛𝗢𝗦𝗧 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗦\n━━━━━━━━━━━━━━━━\n` +
        `⏱️ Uptime: ${h}h ${m}m ${s}s\n` +
        `💾 RAM: ${memMB} MB (Heap: ${heapMB} MB)\n` +
        `📊 Active Threads: ${threadCount}\n` +
        `🔧 Prefix: . (dot)\n` +
        `👤 Owner: Rakib Islam\n` +
        `🤖 Bot: Ghost Bot v2.0\n` +
        `💀 Commands: 200+\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply("❌ Stats error: " + err.message);
    }
  }
};
