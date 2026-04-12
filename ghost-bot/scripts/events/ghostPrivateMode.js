const fs = require("fs-extra");
const path = require("path");

const configPath = path.join(__dirname, "../../ghostConfig.json");
const OWNER_UID = "61576396811594";

module.exports = {
  config: {
    name: "ghostPrivateMode",
    version: "1.0",
    author: "Rakib Islam",
    description: "Blocks non-owner commands in private mode",
    eventType: ["message", "message_reply"]
  },

  onChat: async function ({ event, api }) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (cfg.mode !== "private") return;
      if (event.senderID === OWNER_UID) return;
      if (!event.body) return;

      const prefix = cfg.prefix || ".";
      if (event.body.startsWith(prefix)) {
        // silently block — don't reply, just ignore
        return { cancel: true };
      }
    } catch (e) {
      // if config missing, allow everything
    }
  }
};
