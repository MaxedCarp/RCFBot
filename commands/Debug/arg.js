const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arg')
		.setDescription('arg')
		.addIntegerOption(option =>
			option.setName('int')
			.setDescription('int'))
		.addBooleanOption(option =>
			option.setName('bool')
			.setDescription('bool'))
		.addChannelOption(option =>
			option.setName('channel')
			.setDescription('channel'))
		.addNumberOption(option =>
			option.setName('number')
			.setDescription('number'))
		.addRoleOption(option =>
			option.setName('role')
			.setDescription('role'))
		.addMentionableOption(option =>
			option.setName('mention')
			.setDescription('mention'))
		.addAttachmentOption(option =>
			option.setName('attach')
			.setDescription('attach')),
	async execute(interaction) {
		await interaction.reply({ content: "Nothing", ephemeral: true });
	}
};