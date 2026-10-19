const { Events } = require('discord.js');
const L = require('../utils/levels');

const COOLDOWN = 60_000;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.guild || message.author.bot || message.webhookId) return;

    const u = L.user(message.guildId, message.author.id);
    const now = Date.now();
    if (now - u.lastXp < COOLDOWN) return;

    const before = L.levelFromXp(u.xp);
    u.xp += 15 + Math.floor(Math.random() * 11); // 15-25 XP per minute of chatting
    u.lastXp = now;
    u.messages++;
    L.save();

    const after = L.levelFromXp(u.xp);
    if (after > before) {
      message.channel.send(`🎉 ${message.author} reached **level ${after}**!`).catch(() => {});
    }
  },
};
