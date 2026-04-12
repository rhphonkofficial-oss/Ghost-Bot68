const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "ghostbdtime",
    aliases: ["time", "bdtime", "সময়"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 2,
    role: 0,
    shortDescription: "Show Bangladesh time",
    category: "utility",
    guide: { en: "{p}time — Show current BD time" }
  },

  onStart: async function ({ message }) {
    const bd = moment().tz("Asia/Dhaka");
    const day = bd.format("dddd");
    const date = bd.format("DD MMMM YYYY");
    const time = bd.format("hh:mm:ss A");

    await message.reply(
      `👻 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛 𝗧𝗜𝗠𝗘\n━━━━━━━━━━━━━━━━\n` +
      `📅 Date: ${date}\n⏰ Time: ${time}\n🗓️ Day: ${day}\n🌍 Zone: Asia/Dhaka (GMT+6)\n` +
      `━━━━━━━━━━━━━━━━\n— Rakib Islam | Ghost Bot`
    );
  }
};
