const { Events } = require('discord.js');
const { applyNewChannel } = require('../utils/mod');

// New channels automatically respect the Muted / Prisoner roles.
module.exports = {
  name: Events.ChannelCreate,
  execute: (channel) => applyNewChannel(channel),
};
