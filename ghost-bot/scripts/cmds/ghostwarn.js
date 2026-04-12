const fs = require("fs-extra");
const path = require("path");

const warnFile = path.join(__dirname, "../../database/warns.json");

function getWarns() {
  if (!fs.existsSync(warnFile)) return {};
  return JSON.parse(fs.readFileSync(warnFile, "utf8"));
}
function saveWarns(data) {
  fs.ensureFileSync(warnFile);
  fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "ghostwarn",
    aliases: ["warn2", "gwarn"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    countDown: 3,
    shortDescription: "Warn users (Admin only)",
    longDescription: "Warn a user. 3 warns = auto notice.",
    category: "admin",
    guide: { en: "{p}ghostwarn @user <reason>\n{p}ghostwarn check @user\n{p}ghostwarn reset @user" }
  },

  onStart: async function ({ api, event, args, message }) {
    const mentioned = Object.keys(event.mentions || {});
    const action = args[0]?.toLowerCase();
    const warns = getWarns();

    if (action === "check") {
      if (!mentioned.length) return message.reply("Tag someone to check warns.");
      const uid = mentioned[0];
      const name = event.mentions[uid];
      const count = warns[uid]?.count || 0;
      const reasons = warns[uid]?.reasons || [];
      return message.reply(
        `⚠️ Warn Status: ${name}\n` +
        `Total Warns: ${count}/3\n` +
        (reasons.length ? `Reasons:\n${reasons.map((r, i) => `${i+1}. ${r}`).join("\n")}` : "No reasons logged.")
      );
    }

    if (action === "reset") {
      if (!mentioned.length) return message.reply("Tag someone to reset warns.");
      const uid = mentioned[0];
      const name = event.mentions[uid];
      delete warns[uid];
      saveWarns(warns);
      return message.reply(`✅ Warns reset for ${name}`);
    }

    if (!mentioned.length) return message.reply("Tag someone to warn!\n.ghostwarn @name <reason>");

    const uid = mentioned[0];
    const name = event.mentions[uid];
    const reason = args.filter(a => !a.startsWith("@")).join(" ").replace(action, "").trim() || "Rule violation";

    warns[uid] = warns[uid] || { count: 0, reasons: [] };
    warns[uid].count++;
    warns[uid].reasons.push(reason);
    saveWarns(warns);

    const count = warns[uid].count;

    let extra = "";
    if (count >= 3) extra = "\n🚨 3 warnings reached! Consider kicking this user.";

    await message.reply(
      `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n━━━━━━━━━━━━━━━━\n` +
      `👤 User: ${name}\n❌ Reason: ${reason}\n` +
      `📊 Warns: ${count}/3${extra}\n` +
      `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );
  }
};
