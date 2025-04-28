const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd, alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers the user')
		.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('mr')
                .setDescription('Your in-game Mastery Rank.')
                .setRequired(true))
		.addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play on.')
				.addChoices(
                    { name: 'PC', value: 'PC' },
                    { name: 'Playstation', value: 'Playstation' },
                    { name: 'XBox', value: 'xBox' },
                    { name: 'Switch', value: 'Switch' },
                )
                .setRequired(true)),
	async execute(interaction) {
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			const data = await collection.find({"id": interaction.user.id}).toArray();
			const reg = /^[^ ]+#\d{3}$/;
			const reg2 = /^.+#\d{3}$/;
			if (!data.length > 0) {
				const platform = interaction.options.getString('platform');
				const clan = "Raging Catfish";
				const ign = interaction.options.getString('ign');
				if (ign.match(reg) || (ign.match(reg2) && platform === "xBox")){
					const MR = interaction.options.getInteger('mr');
					if (MR < 36 && MR > -1){
						const obj = { id: interaction.user.id, ign: ign, mr: MR, platform: platform, clan: clan, mains: [], framelist: [], sublist: [], alts: [] };
						collection.insertOne(obj);
						const exampleEmbed = new EmbedBuilder()
							.setColor(0x0099FF)
							.setTitle(`User Registered: ${interaction.user.username} (${interaction.user.displayName})`)
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
						interaction.reply({ content: 'Specified Mastery Rank has to be between 0 and 36!', ephemeral: true });
				}
				else {
					interaction.reply({ content: 'Please make sure your username end with a hashtag and 3 digits as per your ingame profile!\n(For your in-game profile, hover your name in the top left and click "Profile")', ephemeral: true });
				}
			}
			else
			{
				interaction.reply({ content: "Your user data already exists! Please use /unregister in order to delete it before recreating it!", ephemeral: true })
			}
		}
		catch (err) {
			console.log(err);
		}
	}
};