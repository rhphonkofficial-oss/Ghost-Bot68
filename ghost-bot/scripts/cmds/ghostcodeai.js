const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

const OWNER_UID = "61576396811594";

async function callGemini(prompt) {
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Gemini API not configured!");

  const res = await axios.post(
    `${baseUrl}/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
    },
    { headers: { "Content-Type": "application/json" }, timeout: 45000 }
  );
  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

module.exports = {
  config: {
    name: "ghostcodeai",
    aliases: ["aicode", "createcmd", "cmdai"],
    version: "2.0",
    author: "Rakib Islam",
    countDown: 30,
    role: 2,
    shortDescription: "Gemini AI দিয়ে command তৈরি করো (Owner only)",
    longDescription: "Messenger থেকেই Gemini AI দিয়ে নতুন GoatBot command তৈরি করুন এবং GitHub-এ auto-push করুন।",
    category: "owner",
    guide: {
      en: [
        "{p}ghostcodeai <name> | <description>",
        "Example: {p}ghostcodeai hello | সবাইকে hello বলার command",
        "{p}ghostcodeai weather2 | 5-day forecast দেখানোর command",
        "{p}ghostcodeai love | love percentage বের করার fun command"
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only command!\n— Ghost Bot");

    const input = args.join(" ");
    const parts = input.split("|");
    const cmdName = parts[0]?.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const description = parts[1]?.trim() || parts[0]?.trim();

    if (!cmdName || !description) {
      return message.reply(
        `👻 𝗔𝗜 𝗖𝗢𝗗𝗘 𝗖𝗥𝗘𝗔𝗧𝗢𝗥\n━━━━━━━━━━━━━━━━\n` +
        `Usage: .ghostcodeai <name> | <description>\n\n` +
        `উদাহরণ:\n` +
        `.ghostcodeai hello | সবাইকে hello বলার command\n` +
        `.ghostcodeai weather2 | 5-day weather forecast\n` +
        `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
      );
    }

    const cmdPath = path.join(__dirname, `${cmdName}.js`);
    if (fs.existsSync(cmdPath)) {
      return message.reply(`❌ "${cmdName}" নামে command ইতিমধ্যে আছে! অন্য নাম ব্যবহার করুন।`);
    }

    await message.reply(
      `🤖 𝗔𝗜 𝗖𝗢𝗗𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚...\n━━━━━━━━━━━━━━━━\n` +
      `📝 Command: ${cmdName}\n💡 Feature: ${description}\n⏳ Gemini কোড লিখছে...`
    );
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const prompt = `You are an expert GoatBot V2 (fb-chat-api) command developer. Create a complete working command.

Command Name: ${cmdName}
Feature/Description: ${description}
Bot Name: Ghost Bot
Bot Owner: Rakib Islam (UID: 61576396811594)

REQUIREMENTS:
- author MUST be exactly: "Rakib Islam"
- All reply messages must end with: "— Rakib Islam | Ghost Bot"
- Use axios for API calls (it's installed)
- Add proper try/catch error handling
- Use free public APIs only (no API keys needed)
- Make it genuinely functional and useful
- Add Bengali text in replies where natural

Return ONLY raw JavaScript code. No markdown, no code blocks, no explanation.

Template:
const axios = require("axios");
module.exports = {
  config: {
    name: "${cmdName}",
    aliases: [],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "...",
    category: "utility",
    guide: { en: "{p}${cmdName} <args>" }
  },
  onStart: async function ({ api, event, args, message }) {
    // your implementation
  }
};`;

    try {
      const generatedCode = await callGemini(prompt);

      let cleanCode = generatedCode
        .replace(/^```javascript\n?/im, "")
        .replace(/^```js\n?/im, "")
        .replace(/^```\n?/im, "")
        .replace(/\n?```$/im, "")
        .trim();

      if (!cleanCode.includes("module.exports") || !cleanCode.includes("config:")) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`❌ AI ভালো কোড দেয়নি। আবার try করুন বা description আরো স্পষ্ট করুন।`);
      }

      // Force correct author
      cleanCode = cleanCode.replace(/author:\s*["'][^"']*["']/g, 'author: "Rakib Islam"');

      fs.writeFileSync(cmdPath, cleanCode);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Auto-push to GitHub if configured
      const cfgPath = path.join(__dirname, "../../ghostConfig.json");
      let githubMsg = "";
      if (fs.existsSync(cfgPath)) {
        const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
        if (cfg.github?.token && cfg.github?.username && cfg.github?.repo) {
          try {
            const botDir = path.join(__dirname, "../../");
            const commitCmd = [
              `cd "${botDir}"`,
              `git add scripts/cmds/${cmdName}.js`,
              `git commit -m "AI Created: ${cmdName}"`,
              `git push origin main`
            ].join(" && ");
            execSync(commitCmd, { timeout: 30000 });
            githubMsg = `\n🚀 GitHub push সম্পন্ন!\n🔗 github.com/${cfg.github.username}/${cfg.github.repo}`;
          } catch (e) {
            githubMsg = `\n⚠️ GitHub push হয়নি: ${e.message.slice(0, 80)}`;
          }
        }
      }

      await message.reply(
        `✅ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗖𝗥𝗘𝗔𝗧𝗘𝗗!\n━━━━━━━━━━━━━━━━\n` +
        `🤖 Command: .${cmdName}\n` +
        `📝 Feature: ${description}\n` +
        `✍️ Author: Rakib Islam\n` +
        `📦 File: scripts/cmds/${cmdName}.js\n` +
        `━━━━━━━━━━━━━━━━${githubMsg}\n` +
        `💡 Reload করতে: .load ${cmdName}\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`❌ AI Error: ${err.message}\n\nআবার try করুন।\n— Ghost Bot`);
    }
  }
};
