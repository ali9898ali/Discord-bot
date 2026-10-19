const { Events, REST, Routes, ActivityType } = require('discord.js');
const tasks = require('../utils/tasks');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('/play', { type: ActivityType.Listening });

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const body = [...client.commands.values()].map((c) => c.data.toJSON());
    const route = process.env.GUILD_ID
      ? Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID)
      : Routes.applicationCommands(client.user.id);
    await rest.put(route, { body });
    console.log(`Registered ${body.length} commands.`);

    tasks.start(client);
  },
};
