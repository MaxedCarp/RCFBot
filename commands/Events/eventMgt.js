const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('node:path');
//const math = require('node:Math');
const fs2 = require('../../fsfuncs');
const { alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('eventmgt')
		.setDescription('Manages event stats')
		.addSubcommand(subcommand =>
		subcommand
			.setName('increase')
			.setDescription('Increases event score for a user')
			.addStringOption(option =>
				option.setName('event')
				.setDescription('Event')
				.addChoices(
					{ name: 'Gargoyle\'s Cry', value: 'Gargoyle\'s Cry' },
                )
					.setRequired(true))
			.addStringOption(option =>
				option.setName('criteria')
					.setDescription('Criteria')
					.setRequired(true))
			.addIntegerOption(option =>
				option.setName('value')
					.setDescription('Value')
					.setRequired(true))
			.addUserOption(option =>
				option.setName('user')
					.setDescription('User to edit')
					.setRequired(true)))
		.addSubcommand(subcommand =>
		subcommand
			.setName('decrease')
			.setDescription('Decreases event score for a user')
			.addStringOption(option =>
            option.setName('event')
                .setDescription('Event')
				.addChoices(
					{ name: 'Gargoyle\'s Cry', value: 'Gargoyle\'s Cry' },
                )
                .setRequired(true))
			.addStringOption(option =>
				option.setName('criteria')
					.setDescription('Criteria')
					.setRequired(true))
			.addIntegerOption(option =>
				option.setName('value')
					.setDescription('Value')
					.setRequired(true))
			.addUserOption(option =>
            option.setName('user')
                .setDescription('User to edit')
                .setRequired(true)))
		.addSubcommand(subcommand =>
		subcommand
			.setName('get')
			.setDescription('Get event score for a user')
			.addStringOption(option =>
				option.setName('event')
					.setDescription('Event')
					.addChoices(
					{ name: 'Gargoyle\'s Cry', value: 'Gargoyle\'s Cry' },
                )
					.setRequired(true))
			.addUserOption(option =>
				option.setName('user')
                .setDescription('User to edit')
                .setRequired(true))
			.addStringOption(option =>
				option.setName('criteria')
					.setDescription('Criteria')))
		.addSubcommand(subcommand =>
		subcommand
			.setName('leaderboards')
			.setDescription('Get event leaderboards')
			.addStringOption(option =>
				option.setName('event')
					.setDescription('Event')
					.addChoices(
					{ name: 'Gargoyle\'s Cry', value: 'Gargoyle\'s Cry' },
                )
					.setRequired(true)))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "increase"){
			const eve = interaction.options.getString('event');
			const criteria = interaction.options.getString('criteria');
			const value = interaction.options.getInteger('value');
			const user = interaction.options.getUser('user');
			console.log(`Increase; Event ${eve}; User ${user}`)
			const eventFile = path.join(__dirname, '../../../../wfbots', `events.json`);
			let obj = JSON.parse(await fs2.readFile(eventFile));
			if (!obj[eve]){
				await interaction.reply({ content: `Event "${eve}" not found`, ephemeral: true });
				return;
			}
			feve = obj[eve];
			const lowcrit = feve["Criteria"].map(crit => crit.toLowerCase());
			if (lowcrit.indexOf(criteria.toLowerCase()) === -1){
				await interaction.reply({ content: `Criteria "${criteria}" not found`, ephemeral: true });
				return;
			}	
			if (!feve.Users[user.id]){
				interaction.reply({ content: `Event Data related to user: "${user}" not found. Creating!`, ephemeral: true });
				feve.Users[user.id] = {}
				let ifeve = feve.Users[user.id];
				let criter = lowcrit.indexOf(criteria.toLowerCase());
				ifeve[feve.Criteria[criter]] = value;
				feve.Users[user.id] = ifeve;
				obj[eve] = feve;
				await interaction.edit({ content: `Criteria "${criteria}" for user "${user.displayName}" in Event "${eve}" increased by: ${value}`, ephemeral: true });
				await fs2.writeFile(eventFile, JSON.stringify(obj, null, "\t"));
			}
			else {
				let ifeve = feve.Users[user.id];
				let criter = lowcrit.indexOf(criteria.toLowerCase());
				if (!ifeve[feve.Criteria[criter]])
					ifeve[feve.Criteria[criter]] = 0;
				ifeve[feve.Criteria[criter]] += value;
				feve.Users[user.id] = ifeve;
				obj[eve] = feve;
				await interaction.reply({ content: `Criteria "${criteria}" for user "${user.displayName}" in Event "${eve}" increased by: ${value}`, ephemeral: true });
				await fs2.writeFile(eventFile, JSON.stringify(obj, null, "\t"));
			}
		}
		else if (interaction.options.getSubcommand() === "decrease"){
			console.log(`Decrease; Event ${interaction.options.getString('event')}; User ${interaction.options.getUser('user')}`);
			const eve = interaction.options.getString('event');
			const criteria = interaction.options.getString('criteria');
			const value = interaction.options.getInteger('value');
			const user = interaction.options.getUser('user');
			console.log(`Increase; Event ${eve}; User ${user}`)
			const eventFile = path.join(__dirname, '../../../../wfbots', `events.json`);
			let obj = JSON.parse(await fs2.readFile(eventFile));
			if (!obj[eve]){
				await interaction.reply({ content: `Event "${eve}" not found`, ephemeral: true });
				return;
			}
			feve = obj[eve];
			const lowcrit = feve["Criteria"].map(crit => crit.toLowerCase());
			if (lowcrit.indexOf(criteria.toLowerCase()) === -1){
				await interaction.reply({ content: `Criteria "${criteria}" not found`, ephemeral: true });
				return;
			}	
			if (!feve.Users[user.id]){
				await interaction.reply({ content: `Event Data related to user: "${user}" not found!`, ephemeral: true });
			}
			else {
				let ifeve = feve.Users[user.id];
				let criter = lowcrit.indexOf(criteria.toLowerCase());
				if (!ifeve[feve.Criteria[criter]])
					ifeve[feve.Criteria[criter]] = 0;
				else
					ifeve[feve.Criteria[criter]] -= value;
				ifeve[feve.Criteria[criter]] = Math.max(ifeve[feve.Criteria[criter]], 0);
				feve.Users[user.id] = ifeve;
				obj[eve] = feve;
				await interaction.reply({ content: `Criteria "${criteria}" for user "${user.displayName}" in Event "${eve}" decreased by: up to ${value}`, ephemeral: true });
				await fs2.writeFile(eventFile, JSON.stringify(obj, null, "\t"));
			}
		}
		else if (interaction.options.getSubcommand() === "get"){
			console.log(`Get; Event ${interaction.options.getString('event')}; User ${interaction.options.getUser('user')}`);
			const eve = interaction.options.getString('event');
			const criteria = interaction.options.getString('criteria');
			const user = interaction.options.getUser('user');
			const eventFile = path.join(__dirname, '../../../../wfbots', `events.json`);
			let obj = JSON.parse(await fs2.readFile(eventFile));
			if (!obj[eve]){
				interaction.reply({ content: `Event "${eve}" not found`, ephemeral: true });
				return;
			}
			let feve = obj[eve];
			if (!feve.Users[user.id]){
				await interaction.reply({ content: `${user.displayName}'s Score: 0 (No user data found!)`, ephemeral: true });
				return;
			}
			let ifeve = feve.Users[user.id];
			const lowcrit = feve["Criteria"].map(crit => crit.toLowerCase());
			if (lowcrit.indexOf(criteria.toLowerCase()) === -1){
				if (feve["Criteria"].indexOf(criteria) === -1){
					await interaction.reply({ content: `Criteria "${criteria}" not found`, ephemeral: true });
					return;
				}
				else {
				let criter = lowcrit.indexOf(criteria.toLowerCase());
				if (!ifeve[feve.Criteria[criter]])
					criter = 0;
				else
					criter = ifeve[feve.Criteria[criter]];
				await interaction.reply({ content: `${user.displayName}'s Score: ${criter} (Criteria: ${criteria})`, ephemeral: true });
				}
			}
			else {
				let ifeve = feve.Users[user.id];
				let criter = 0;
				feve["Criteria"].forEach(crit => criter += (ifeve[crit] || 0));
				await interaction.reply({ content: `${user.displayName}'s Score: ${criter}`, ephemeral: true });
			}
		}
		else if (interaction.options.getSubcommand() === "leaderboards"){
			console.log(`Leaderboards; Event ${interaction.options.getString('event')}`);
			const eve = interaction.options.getString('event');
			const eventFile = path.join(__dirname, '../../../../wfbots', `events.json`);
			let obj = JSON.parse(await fs2.readFile(eventFile));
			if (!obj[eve]){
				interaction.reply({ content: `Event "${eve}" not found`, ephemeral: true });
				return;
			}
			exampleEmbed = new EmbedBuilder()
				.setColor(0x69FA04)
				.setTitle(`Event "${eve}" Leaderboards:`)
				.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
			exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
			let feve = obj[eve];
			Object.keys(feve.Users).forEach(user => {
				let member = interaction.guild.members.cache.get(user);
				let ifeve = feve.Users[user];
				let criter = 0;
				let str = "";
				feve["Criteria"].forEach(crit => {
					str += crit + ": " + (ifeve[crit] || 0) + "\n";
					criter += (ifeve[crit] || 0);
				});
				str += `Total: ${criter}`;
				if (user === "275305152842301440")
					str += " (Disqualified)"
				exampleEmbed.addFields({ name: member.displayName, value: str, inline: true });
				//interaction.channel.send(str);
			});
			await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
		}
	},
};