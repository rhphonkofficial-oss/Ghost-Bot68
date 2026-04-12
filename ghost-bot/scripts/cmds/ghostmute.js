const fs = require("fs-extra");
const path = require("path");

const muteFile = path.join(__dirname, "../../database/ghostmutes.json");

function getMutes() {
  if (!fs.existsSync(muteFile)) return {};
  return JSON.parse(fs.readFileSync(muteFile, "utf8"));
}
function saveMutes(data) {
  fs.ensureFileSync(muteFile);
  fs.writeFileSync(muteFile, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "ghostmute",
    aliases: ["mute2", "gmute"],
    version: "1.0",
    author: "Rakib Islam",
    role: 1,
    shortDescription: "Mute/unmute users (Admin only)",
    category: "admin",
    guide: { en: "{p}ghostmute @user <minutes>\n{p}ghostmute unmute @user" }
  },

  onStart: async function ({ api, event, args, message }) {
    const mentioned = Object.keys(event.mentions || {});
    const action = args[0]?.toLowerCase();
    const mutes = getMutes();

    if (action === "unmute") {
      if (!mentioned.length) return message.reply("Tag someone to unmute!");
      const uid = mentioned[0];
      const name = event.mentions[uid];
      delete mutes[uid];
      saveMutes(mutes);
      return message.reply(`✅ ${name} has been unmuted!`);
    }

    if (!mentioned.length) return message.reply("Usage: .ghostmute @user <minutes>\n.ghostmute unmute @user");
    const uid = mentioned[0];
    const name = event.mentions[uid];
    const mins = parseInt(args.filter(a => !a.startsWith("@"))[0]) || 10;

    mutes[uid] = { until: Date.now() + mins * 60 * 1000 };
    saveMutes(mutes);

    await message.reply(
      `🔇 𝗨𝗦𝗘𝗥 𝗠𝗨𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━\n` +
      `👤 User: ${name}\n⏱️ Duration: ${mins} minutes\n` +
      `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );

    // Auto-unmute
    setTimeout(() => {
      const m = getMutes();
      if (m[uid]) { delete m[uid]; saveMutes(m); }
      api.sendMessage(`✅ ${name} has been automatically unmuted after ${mins} minutes.\n— Ghost Bot`, event.threadID);
    }, mins * 60 * 1000);
  },

  onChat: async function ({ event, message }) {
    const mutes = getMutes();
    if (!mutes[event.senderID]) return;
    if (Date.now() > mutes[event.senderID].until) {
      delete mutes[event.senderID];
      saveMutes(mutes);
      return;
    }
    // Silently ignore muted user messages — or send warning
    // await message.reply("🔇 You are muted! Please wait.");
  }
};
