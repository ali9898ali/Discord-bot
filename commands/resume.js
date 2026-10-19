const { SlashCommandBuilder } = require('discord.js');
const { needActive, reply } = require('../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused track'),

  async execute(interaction) {
    const state = await needActive(interaction);
    if (!state) return;
    if (!state.current) return reply(interaction, '❌ Nothing is playing.');
    return reply(interaction, state.player.unpause() ? '▶️ Resumed.' : "❌ The track isn't paused.");
  },
};
