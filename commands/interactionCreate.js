const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const { client } = interaction;

    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      return command?.autocomplete?.(interaction).catch(() => {});
    }

    let handler;
    if (interaction.isChatInputCommand()) {
      handler = client.commands.get(interaction.commandName)?.execute;
      if (handler && !interaction.inGuild()) {
        return interaction.reply({ content: '❌ This command only works inside a server.', flags: MessageFlags.Ephemeral });
      }
      if (handler) handler = handler.bind(client.commands.get(interaction.commandName));
    } else if (interaction.isButton()) {
      const entry = [...client.buttons.entries()].find(([prefix]) => interaction.customId.startsWith(prefix));
      handler = entry?.[1].button?.bind(entry[1]);
    }
    if (!handler) return;

    try {
      await handler(interaction);
    } catch (err) {
      console.error(`Interaction error (${interaction.commandName || interaction.customId}):`, err);
      const content = '⚠️ Something went wrong while running that.';
      if (interaction.deferred || interaction.replied) await interaction.editReply({ content, components: [] }).catch(() => {});
      else await interaction.reply({ content, flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  },
};
