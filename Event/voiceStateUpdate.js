const { Events } = require('discord.js');
const { states, destroyState, EMPTY_LEAVE_MS } = require('../utils/music');
const mod = require('../utils/mod');

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const client = newState.client;

    // Re-apply a stored voice mute when a muted member joins a voice channel.
    if (newState.channelId && !oldState.channelId && !newState.member.user.bot) {
      if (mod.guildData(newState.guild.id).voiceMutes[newState.id] && !newState.serverMute) {
        await newState.setMute(true, 'Active voice mute').catch(() => {});
      }
    }

    const state = states.get(oldState.guild.id);
    if (!state) return;

    // The bot itself was disconnected from voice
    if (oldState.id === client.user.id && !newState.channelId) return destroyState(state);

    // Leave when everyone else has left (unless 24/7 mode is on)
    const channel = state.guild.channels.cache.get(state.connection.joinConfig.channelId);
    if (!channel) return;
    clearTimeout(state.emptyTimer);
    if (channel.members.filter((m) => !m.user.bot).size === 0 && !state.stay) {
      state.emptyTimer = setTimeout(() => {
        state.textChannel?.send('👋 Left the voice channel because it was empty.').catch(() => {});
        destroyState(state);
      }, EMPTY_LEAVE_MS);
    }
  },
};
