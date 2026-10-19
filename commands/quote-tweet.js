const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { reply, fail, trunc } = require('../utils/common');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote-tweet')
    .setDescription('Create a Quote-Tweet message')
    .addStringOption((o) => o.setName('tweet').setDescription('Your tweet text').setMaxLength(280).setRequired(true))
    .addStringOption((o) => o.setName('quote').setDescription('The text you are quoting').setMaxLength(280))
    .addUserOption((o) => o.setName('quote_author').setDescription('Who wrote the quoted text'))
    .addAttachmentOption((o) => o.setName('image').setDescription('Attach an image to the tweet')),

  async execute(interaction) {
    const text = interaction.options.getString('tweet');
    const quote = interaction.options.getString('quote');
    const quoteAuthor = interaction.options.getUser('quote_author');
    const image = interaction.options.getAttachment('image');

    if (image && !image.contentType?.startsWith('image/')) return fail(interaction, '❌ The attachment must be an image.');
    if (quoteAuthor && !quote) return fail(interaction, '❌ Add the `quote` text when you pick a `quote_author`.');

    const member = interaction.member;
    let description = text;
    if (quote) {
      const who = quoteAuthor ? `**${quoteAuthor.displayName}** @${quoteAuthor.username}` : '**Quoted tweet**';
      description += `\n\n> ${who}\n> ${trunc(quote, 280).replace(/\n/g, '\n> ')}`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x1d9bf0)
      .setAuthor({ name: `${member.displayName} (@${interaction.user.username})`, iconURL: member.displayAvatarURL() })
      .setDescription(description)
      .setFooter({ text: 'Twitter' })
      .setTimestamp();
    if (image) embed.setImage(image.url);
    return reply(interaction, { embeds: [embed] });
  },
};
