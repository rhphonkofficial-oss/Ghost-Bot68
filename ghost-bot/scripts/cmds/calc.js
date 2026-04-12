module.exports = {
  config: {
    name: "calc",
    aliases: ["math", "calculate", "হিসাব"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 2,
    role: 0,
    shortDescription: "Calculator",
    longDescription: "Calculate any math expression safely",
    category: "utility",
    guide: { en: "{p}calc 5 + 3 * 2\n{p}calc 100 / 4 + 50" }
  },

  onStart: async function ({ message, args }) {
    const expr = args.join(" ").trim();
    if (!expr) return message.reply("Usage: .calc <expression>\nExample: .calc 5 + 3 * 2");

    try {
      // Safe evaluation - only allow math characters
      if (/[^0-9+\-*/().\s%]/.test(expr)) {
        return message.reply("❌ Only math operations allowed! (+, -, *, /, %, ())\nExample: .calc 5 + 3");
      }
      const result = Function('"use strict"; return (' + expr + ')')();
      await message.reply(
        `👻 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📐 Expression: ${expr}\n` +
        `✅ Result: ${result}\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `— Ghost Bot | Rakib Islam`
      );
    } catch (err) {
      message.reply("❌ Invalid expression! Try: .calc 5 + 3 * 2");
    }
  }
};
