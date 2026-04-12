const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    aliases: ["wthr", "আবহাওয়া"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Get weather info",
    longDescription: "Get current weather for any city",
    category: "utility",
    guide: { en: "{p}weather <city>\nExample: {p}weather Dhaka" }
  },

  onStart: async function ({ message, args }) {
    const city = args.join(" ").trim() || "Dhaka";
    try {
      const res = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        { timeout: 10000 }
      );
      const w = res.data.current_condition?.[0];
      if (!w) return message.reply("❌ City not found!");

      const desc = w.weatherDesc?.[0]?.value || "Unknown";
      const temp = w.temp_C;
      const feels = w.FeelsLikeC;
      const humidity = w.humidity;
      const wind = w.windspeedKmph;
      const vis = w.visibility;

      await message.reply(
        `👻 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📍 City: ${city}\n` +
        `🌤️ Condition: ${desc}\n` +
        `🌡️ Temp: ${temp}°C (Feels like ${feels}°C)\n` +
        `💧 Humidity: ${humidity}%\n` +
        `💨 Wind: ${wind} km/h\n` +
        `👁️ Visibility: ${vis} km\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `— Rakib Islam | Ghost Bot`
      );
    } catch (err) {
      message.reply(`❌ Could not get weather for "${city}". Try: .weather Dhaka`);
    }
  }
};
