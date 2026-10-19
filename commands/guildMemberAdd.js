const { Events } = require('discord.js');
const { guildData } = require('../utils/mod');

// Re-apply mute / prison if someone leaves and rejoins to dodge a punishment.
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const d = guildData(member.guild.id);
    const roles = [];
    if (d.mutes[member.id] && d.roles.muted) roles.push(d.roles.muted);
    if (d.prisons[member.id] && d.roles.prison) roles.push(d.roles.prison);
    if (roles.length) await member.roles.add(roles, 'Active punishment').catch(() => {});
  },
};
