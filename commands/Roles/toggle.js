const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Toggles things.')
		.addSubcommand(subcommand =>
		subcommand
			.setName('spoilers')
			.setDescription('Toggles Spoilers.'))
			.addSubcommand(subcommand =>
		subcommand
			.setName('leaks')
			.setDescription('Toggles Leaks.')),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			if (interaction.options.getSubcommand() === "spoilers"){
				const guild = interaction.guild;
				const member = interaction.member;
				const role = guild.roles.cache.find(role => role.name === 'spoilers');
				const spoiled = !!member.roles.cache.has(role.id);
				let msg;
				if (spoiled){
					await member.roles.remove(role);
					msg = "Spoilers role removed!";
				}
				else{
					await member.roles.add(role);
					msg = "Spoilers role added!";
				}
				await interaction.reply( { content: msg, ephemeral: true} );
			}
			else if (interaction.options.getSubcommand() === "leaks") {
				const guild = interaction.guild;
				const member = interaction.member;
				const role = guild.roles.cache.find(role => role.name === 'leaks');
				const spoiled = !!member.roles.cache.has(role.id);
				let msg;
				if (spoiled){
					await member.roles.remove(role);
					msg = "Leaks role removed!";
				}
				else{
					await member.roles.add(role);
					msg = "Leaks role added!";
				}
				await interaction.reply( { content: msg, ephemeral: true} );
			}
		}
	}
};