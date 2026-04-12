const fs = require("fs-extra");
const path = require("path");

const banFile = path.join(__dirname, "../../database/ghostbans.json");
const OWNER_UID = "61576396811594";

function getBans() {
  if (!fs.existsSync(banFile)) return {};
  return JSON.parse(fs.readFileSync(banFile, "utf8"));
}
function saveBans(data) {
  fs.ensureFileSync(banFile);
  fs.writeFileSync(banFile, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "ghostban",
    aliases: ["gban", "botban"],
    version: "1.0",
    author: "Rakib Islam",
    role: 2,
    shortDescription: "Ban/unban user from bot (Owner only)",
    category: "owner",
    guide: { en: "{p}ghostban @user <reason> — Ban\n{p}ghostban unban @user — Unban\n{p}ghostban list — See banned users" }
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only command!");

    const bans = getBans();
    const action = args[0]?.toLowerCase();
    const mentioned = Object.keys(event.mentions || {});

    if (action === "list") {
      const list = Object.entries(bans).map(([uid, info]) => `• ${uid}: ${info.reason}`).join("\n") || "No banned users";
      return message.reply(`👻 𝗕𝗔𝗡𝗡𝗘𝗗 𝗨𝗦𝗘𝗥𝗦\n━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━`);
    }

    if (!mentioned.length) return message.reply("Tag someone!\n.ghostban @user <reason>\n.ghostban unban @user");
    const uid = mentioned[0];
    const name = event.mentions[uid];

    if (action === "unban") {
      delete bans[uid];
      saveBans(bans);
      return message.reply(`✅ ${name} has been unbanned from Ghost Bot!`);
    }

    const reason = args.filter(a => !a.startsWith("@")).join(" ").replace(action, "").trim() || "Owner decision";
    bans[uid] = { reason, bannedAt: new Date().toISOString() };
    saveBans(bans);

    await message.reply(
      `🚫 𝗚𝗛𝗢𝗦𝗧 𝗕𝗔𝗡\n━━━━━━━━━━━━━━━━\n` +
      `👤 User: ${name}\n❌ Reason: ${reason}\n` +
      `🚫 This user can no longer use Ghost Bot!\n` +
      `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );
  }
};
