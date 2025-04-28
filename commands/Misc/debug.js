const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Debugs')
		.addSubcommand(subcommand =>
		subcommand
			.setName('profile')
			.setDescription('Debugs Profile'))
		.addSubcommand(subcommand =>
		subcommand
			.setName('register')
			.setDescription('Force registers a user')
			.addUserOption(option =>
            option.setName('user')
                .setDescription('User to register')
                .setRequired(true))
			.addStringOption(option =>
            option.setName('ign')
                .setDescription('In-Game Name')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('mr')
                .setDescription('Mastery Rank')
                .setRequired(true))
		.addStringOption(option =>
            option.setName('platform')
                .setDescription('Platform')
				.addChoices(
                    { name: 'PC', value: 'PC' },
                    { name: 'Playstation', value: 'Playstation' },
                    { name: 'XBox', value: 'XBox' },
                    { name: 'Switch', value: 'Switch' },
                )
                .setRequired(true))
				.addStringOption(option =>
            option.setName('clan')
                .setDescription('What clan are you in?')
				.addChoices(
                    { name: 'Secret Agents', value: 'Secret Agents' },
                    { name: 'Raging Catfish', value: 'Raging Catfish' },
                    { name: 'Mag Cult', value: 'THE MAG CULT' },
					{ name: 'Homeland Division', value: 'Homeland Division' },
					{ name: 'The Ebonshade Guard', value: 'The Ebonshade Guard' },
                )
                .setRequired(true)))
			.addSubcommand(subcommand =>
		subcommand
			.setName('unregister')
			.setDescription('Force unregisters the user')
			.addUserOption(option =>
            option.setName('user')
                .setDescription('User to register')
                .setRequired(true)))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === "register"){
			const user = interaction.options.getUser('user');
			const userpath = path.join(__dirname, '../../../../wfbots/userdata', `${user.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			const reg = /^[^ ]+#\d{3}$/;
			const reg2 = /^.+#\d{3}$/;
			if (await !!!exist) {
				const ign = interaction.options.getString('ign');
				const platform = interaction.options.getString('platform');
				const clan = interaction.options.getString('clan');
				if (ign.match(reg) || (ign.match(reg2) && platform === "xBox")){
					const MR = interaction.options.getInteger('mr');
					if (MR < 35 && MR > -1){
						let obj = {"ign": ign, "mr": MR, "platform": platform, "clan": clan, "mains": [], "framelist": [], "sublist": [], "alts": []};
						await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
						const exampleEmbed = new EmbedBuilder()
							.setColor(0x0099FF)
							.setTitle(`User Registered: ${user.username} (${user.displayName})`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
							.addFields(
							{ name: `In-Game Name: `, value: ign },
							{ name: `Mastery Rank: `, value: "" + MR },
							{ name: `Platform: `, value: platform }
							);
						exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						if (interaction.guild.id === "621701090940944384")
						{
							const guild = interaction.guild;
							const member = interaction.member;
							let role = guild.roles.cache.find(role => role.name === 'Member');
							if (!member.roles.cache.has(role.id))
								await member.roles.add(role);
							role = guild.roles.cache.find(role => role.name === 'Salmon');
							if (!member.roles.cache.has(role.id))
								await member.roles.add(role);
							member.setNickname(ign);
						}
						await interaction.reply({ embeds: [exampleEmbed] });
					}
					else
					interaction.reply({ content: 'Specified Mastery Rank has to be between 0 an 35!', ephemeral: true });
				}
				else {
					interaction.reply({ content: "Your IGN does not match the in-game standards!", ephemeral: true });
				}
			}
			else
			{
				interaction.reply({ content: "Your user data already exists! Please use /unregister in order to delete it before recreating it!", ephemeral: true })
			}
		}
		else if (interaction.options.getSubcommand() === "unregister"){
			const user = interaction.options.getMember('user');
			const userpath = path.join(__dirname, '../../../../wfbots/userdata', `${user.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (await !!exist) {
				if (await fs2.exists(userpath)) { // verifying presence of the user data
					await fs2.unlink(userpath); // deleting the user data
					await interaction.reply({ content: "The selected user's has been successfully deleted!", ephemeral: true });
				}
				else
				{
					await interaction.reply({ content: "The selected user isn't registered to begin with!", ephemeral: true });
				}
			}
		}
	},
};