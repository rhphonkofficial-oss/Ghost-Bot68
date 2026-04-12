const OWNER_UID = "61576396811594";
const { exec } = require("child_process");

module.exports = {
  config: {
    name: "ghostcmd",
    aliases: ["cmd", "addcmd"],
    version: "1.0",
    author: "Rakib Islam",
    role: 2,
    shortDescription: "Create new command from Messenger (Owner only)",
    category: "owner",
    guide: {
      en: "{p}ghostcmd new <name> <description> <response>\nExample:\n{p}ghostcmd new hello Say hello Ghost Bot reply hello!\n{p}ghostcmd list — See all ghost custom commands\n{p}ghostcmd delete <name>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.senderID !== OWNER_UID) return message.reply("👻 Owner only!");

    const fs = require("fs-extra");
    const path = require("path");
    const customDir = path.join(__dirname, "../../ghostCustomCmds");
    const customCmdsFile = path.join(customDir, "cmds.json");

    fs.ensureDirSync(customDir);
    const cmds = fs.existsSync(customCmdsFile) ? JSON.parse(fs.readFileSync(customCmdsFile)) : {};

    const action = args[0]?.toLowerCase();

    if (action === "list") {
      const list = Object.keys(cmds).length ? Object.entries(cmds).map(([n, c]) => `• .${n} — ${c.desc}`).join("\n") : "No custom commands yet.";
      return message.reply(`👻 𝗖𝗨𝗦𝗧𝗢𝗠 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n━━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━━`);
    }

    if (action === "delete") {
      const name = args[1]?.toLowerCase();
      if (!name || !cmds[name]) return message.reply("Command not found!");
      delete cmds[name];
      fs.writeFileSync(customCmdsFile, JSON.stringify(cmds, null, 2));
      return message.reply(`✅ Command ".${name}" deleted!`);
    }

    if (action === "new") {
      const name = args[1]?.toLowerCase();
      const rest = args.slice(2).join(" ");
      const parts = rest.split("|");
      const desc = parts[0]?.trim() || "Custom command";
      const response = parts[1]?.trim() || rest;
      if (!name || !response) return message.reply("Usage: .ghostcmd new <name> <desc> | <response>\nExample: .ghostcmd new hi Ghost Bot greets you | Hello! How are you? 👻");
      cmds[name] = { desc, response };
      fs.writeFileSync(customCmdsFile, JSON.stringify(cmds, null, 2));

      // Create actual command file
      const cmdContent = `module.exports = { config: { name: "${name}", author: "Rakib Islam", role: 0, usePrefix: true, category: "custom" }, onStart: async function({ message }) { await message.reply(\`${response.replace(/`/g, "\\`")}\`); } };`;
      fs.writeFileSync(path.join(__dirname, `${name}.js`), cmdContent);

      return message.reply(`✅ Custom command created!\n.${name} — ${desc}\nReply: ${response}\n\nUse .${name} to test it!`);
    }

    message.reply("Usage:\n.ghostcmd new <name> <desc> | <response>\n.ghostcmd list\n.ghostcmd delete <name>");
  }
};
