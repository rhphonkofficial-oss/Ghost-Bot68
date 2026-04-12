module.exports = {
  config: {
    name: "fakeid",
    aliases: ["fake", "fakeprofile"],
    version: "1.0",
    author: "Rakib Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Generate fake identity for fun",
    category: "fun",
    guide: { en: "{p}fakeid — Generate random fake profile" }
  },

  onStart: async function ({ message }) {
    const names = ["Arafat Hossain","Tanvir Ahmed","Nadia Islam","Sadia Rahman","Rafiq Uddin","Mithila Chowdhury","Sabbir Khan","Riya Das","Emon Sarker","Priya Barua"];
    const cities = ["Dhaka","Chittagong","Sylhet","Rajshahi","Khulna","Barisal","Comilla","Mymensingh","Rangpur","Narayanganj"];
    const jobs = ["Software Engineer","Student","Freelancer","Doctor","Teacher","Business Person","Gamer","Artist","Traveler","Photographer"];
    const hobbies = ["Gaming","Travelling","Reading","Photography","Music","Cooking","Drawing","Watching Anime","Coding","Football"];

    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const hobby1 = hobbies[Math.floor(Math.random() * hobbies.length)];
    const hobby2 = hobbies.filter(h => h !== hobby1)[Math.floor(Math.random() * (hobbies.length - 1))];
    const age = Math.floor(Math.random() * 15) + 18;
    const blood = ["A+","A-","B+","B-","O+","O-","AB+","AB-"][Math.floor(Math.random() * 8)];
    const phone = `01${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`;

    await message.reply(
      `👻 𝗙𝗔𝗞𝗘 𝗜𝗗\n━━━━━━━━━━━━━━━━\n` +
      `👤 Name: ${name}\n🎂 Age: ${age}\n🩸 Blood: ${blood}\n` +
      `🌍 City: ${city}\n💼 Job: ${job}\n` +
      `📞 Phone: ${phone}\n🎮 Hobbies: ${hobby1}, ${hobby2}\n` +
      `━━━━━━━━━━━━━━━━\n⚠️ This is fake! For fun only!\n— Ghost Bot | Rakib Islam`
    );
  }
};
