const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const HF_API = "https://api-inference.huggingface.co/models";

// Public free HF models — no API key needed for some, or use token from ghostConfig
async function queryHF(model, payload, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await axios.post(`${HF_API}/${model}`, payload, {
    headers,
    responseType: payload.inputs && typeof payload.inputs === "string" ? "json" : "arraybuffer",
    timeout: 30000
  });
  return res.data;
}

module.exports = {
  config: {
    name: "hf",
    aliases: ["huggingface", "aiart", "aitext", "hfai"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 15,
    role: 0,
    shortDescription: "Hugging Face AI features",
    longDescription: "Hugging Face free AI models: image generation, sentiment, translation, and more",
    category: "ai",
    guide: {
      en: [
        "{p}hf image <prompt> — AI image generate করো (free)",
        "{p}hf sentiment <text> — Text-এর emotion detect করো",
        "{p}hf summary <text> — যেকোনো text summarize করো",
        "{p}hf chat <message> — AI chatbot",
        "{p}hf setup <hf_token> — HuggingFace token set করো (Owner only)"
      ].join("\n")
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const action = args[0]?.toLowerCase();
    const input = args.slice(1).join(" ").trim();

    const cfgPath = path.join(__dirname, "../../ghostConfig.json");
    const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath)) : {};
    const hfToken = cfg.hfToken || null;
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    // ── Setup HF Token (Owner only) ──
    if (action === "setup") {
      if (event.senderID !== "61576396811594") return message.reply("👻 Owner only!");
      const token = args[1];
      if (!token) return message.reply("Usage: .hf setup <your_hf_token>\n\nGet token from: huggingface.co/settings/tokens");
      cfg.hfToken = token;
      fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
      return message.reply("✅ HuggingFace token saved!\nNow use .hf image <prompt> for better AI images\n— Ghost Bot");
    }

    // ── AI Image Generation ──
    if (action === "image" || action === "img" || action === "art") {
      if (!input) return message.reply("Usage: .hf image <prompt>\nExample: .hf image a ghost in moonlight");
      await message.reply(`🎨 AI image তৈরি হচ্ছে...\nPrompt: "${input}"\n⏳ একটু সময় নেবে...`);
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      try {
        // Use stable-diffusion or FLUX free model
        const model = "stabilityai/stable-diffusion-xl-base-1.0";
        const data = await queryHF(model, { inputs: input }, hfToken);

        if (!data || data.byteLength < 1000) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return message.reply(`❌ Image তৈরি হয়নি। HF model busy হতে পারে।\nHF token set করলে better results পাবে: .hf setup <token>`);
        }

        const imgPath = path.join(cacheDir, `hf_img_${Date.now()}.png`);
        fs.writeFileSync(imgPath, Buffer.from(data));
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        await message.reply({
          body: `👻 𝗔𝗜 𝗜𝗠𝗔𝗚𝗘\n━━━━━━━━━━━━━━━━\n🎨 Prompt: ${input}\n🤖 Model: Stable Diffusion XL\n━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`,
          attachment: fs.createReadStream(imgPath)
        });
        setTimeout(() => { try { fs.unlinkSync(imgPath); } catch (e) {} }, 15000);
      } catch (err) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        message.reply(`❌ Error: ${err.response?.data?.error || err.message}\n\nModel loading হচ্ছে হয়তো, একটু পরে try করুন।\n— Ghost Bot`);
      }
      return;
    }

    // ── Sentiment Analysis ──
    if (action === "sentiment" || action === "emotion" || action === "feel") {
      if (!input) return message.reply("Usage: .hf sentiment <text>\nExample: .hf sentiment I love Ghost Bot!");
      await message.reply(`🔍 Analyzing: "${input}"...`);
      try {
        const result = await queryHF("distilbert/distilbert-base-uncased-finetuned-sst-2-english", { inputs: input }, hfToken);
        const top = Array.isArray(result?.[0]) ? result[0].sort((a, b) => b.score - a.score)[0] : result;
        const label = top?.label || "UNKNOWN";
        const score = ((top?.score || 0) * 100).toFixed(1);
        const emoji = label === "POSITIVE" ? "😊" : label === "NEGATIVE" ? "😔" : "😐";

        await message.reply(
          `👻 𝗦𝗘𝗡𝗧𝗜𝗠𝗘𝗡𝗧 𝗔𝗡𝗔𝗟𝗬𝗦𝗜𝗦\n━━━━━━━━━━━━━━━━\n` +
          `📝 Text: "${input}"\n` +
          `${emoji} Result: ${label}\n` +
          `📊 Confidence: ${score}%\n` +
          `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
        );
      } catch (err) {
        message.reply(`❌ Error: ${err.message}\n— Ghost Bot`);
      }
      return;
    }

    // ── Text Summarization ──
    if (action === "summary" || action === "summarize") {
      if (!input) return message.reply("Usage: .hf summary <long text>\nExample: .hf summary The quick brown fox...");
      if (input.length < 50) return message.reply("❌ Text অনেক ছোট! অন্তত ৫০ character দিন।");
      await message.reply("📝 Summarizing...");
      try {
        const result = await queryHF("facebook/bart-large-cnn", {
          inputs: input,
          parameters: { max_length: 100, min_length: 30 }
        }, hfToken);
        const summary = result?.[0]?.summary_text || result?.summary_text || "Summary তৈরি হয়নি।";
        await message.reply(
          `👻 𝗧𝗘𝗫𝗧 𝗦𝗨𝗠𝗠𝗔𝗥𝗬\n━━━━━━━━━━━━━━━━\n` +
          `📝 Original (${input.length} chars)\n\n` +
          `📋 Summary:\n${summary}\n` +
          `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
        );
      } catch (err) {
        message.reply(`❌ Error: ${err.message}\n— Ghost Bot`);
      }
      return;
    }

    // ── AI Chat ──
    if (action === "chat" || action === "talk") {
      if (!input) return message.reply("Usage: .hf chat <message>\nExample: .hf chat Tell me about Bangladesh");
      await message.reply("🤖 Thinking...");
      try {
        const result = await queryHF("microsoft/DialoGPT-large", {
          inputs: { text: input }
        }, hfToken);
        const reply = result?.generated_text || result?.[0]?.generated_text || "কোনো response পাওয়া যায়নি।";
        await message.reply(
          `👻 𝗔𝗜 𝗖𝗛𝗔𝗧\n━━━━━━━━━━━━━━━━\n` +
          `❓ You: ${input}\n\n🤖 AI: ${reply}\n` +
          `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
        );
      } catch (err) {
        message.reply(`❌ Error: ${err.message}\n— Ghost Bot`);
      }
      return;
    }

    // Default help
    message.reply(
      `👻 𝗛𝗨𝗚𝗚𝗜𝗡𝗚 𝗙𝗔𝗖𝗘 𝗔𝗜\n━━━━━━━━━━━━━━━━\n` +
      `.hf image <prompt> — AI Image তৈরি\n` +
      `.hf sentiment <text> — Emotion detect\n` +
      `.hf summary <text> — Text summarize\n` +
      `.hf chat <message> — AI chatbot\n` +
      `.hf setup <token> — HF token set (Owner)\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `💡 Token পেতে: huggingface.co/settings/tokens\n` +
      `— Rakib Islam | Ghost Bot`
    );
  }
};
