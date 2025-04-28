const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd, alli, mrs } = require('../../config.json');
const { emb } = require('../../clanicons.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Prints out your profile')
		.addStringOption(option =>
            option.setName('mode')
                .setDescription('Extended mode displays frames and subsumed abilities.')
				.addChoices(
                    { name: 'Simple', value: 'simple' },
                    { name: 'Extended', value: 'extended' }
				)
            .setRequired(true))
		.addUserOption(option =>
            option.setName('user')
                .setDescription('User to check the profile for')),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			colframes = dbo.collection("frames");
			const regFrames = await colframes.find({name: {$regex: '^[^ ]*$'}}).toArray();
			const primeFrames = await colframes.find({name: {$regex: '^.*[ ].*$'}}).toArray();
			const data = await collection.find({"id": user?.id ||interaction.user.id}).toArray();
			if (data.length > 0) {
				let obj = await collection.find({"id": user?.id ||interaction.user.id}).toArray();
				obj = obj[0];
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`${obj.ign}'s Profile`)
					.setAuthor({ name: `${(user?.displayName || interaction.user.displayName)}`, iconURL: `${(user?.displayAvatarURL() || interaction.member.displayAvatarURL())}` })
					.addFields(
					//{ name: `In-Game Name`, value: obj.ign, inline: true },
					{ name: `Mastery Rank`, value: ((obj.mr > 30 && obj.mr !== 69) ? "<:Legend:1197449912833560576>" + (obj.mr - 30) + ` (<:${obj.mr}_:${mrs[obj.mr][0]}>${mrs[obj.mr][1]})`: obj.mr + ` (<:${obj.mr}_:${mrs[obj.mr][0]}>${mrs[obj.mr][1]})`), inline: true },
					);
				if (obj.clan !== ""){
					exampleEmbed.addFields({ name: `Clan`, value: obj.clan, inline: true });
					exampleEmbed.setThumbnail(emb[obj.clan]);
				}
				exampleEmbed.addFields({ name: `Platform`, value: obj.platform, inline: true });
				const mode = interaction.options.getString('mode');
				if (obj.mains.length > 0)
					exampleEmbed.addFields({ name: `Main Frame${obj.mains.length > 1 ? "s " + "(" + obj.mains.length + ")" : ""}`, value: obj.mains.sort().toString().replaceAll(',', ', ') });
				if (mode === "extended") {
					if (obj.framelist.length > 0)
					{
						var ls = obj.framelist.filter(a => !a.includes("Prime") && !a.includes("Umbra"));
						var count = ls.length;
						var ls2 = ls.sort().toString();
						let n = 4;
						let ch = ',';

						let regex = new RegExp("((?:[^" +ch+ "]*" +ch+ "){" + (n-1) + "}[^" +ch+ "]*)" +ch, "g");

						ls2 = ls2.replace(regex, '$1,\n');
						if (ls.length > 0)
							exampleEmbed.addFields({ name: `Frames (${ls.length} / ${await colframes.count({name: {$regex: '^[^ ]*$'}})})`, value: ls2.replaceAll(',', ', ') });
						ls = obj.framelist.filter(a => !!a.includes("Prime") || !!a.includes("Umbra"));
						testtt = obj.framelist.filter(a => !!a.includes("Excalibur Prime"));
						ntst = 1;
						ntst -= testtt.length;
						count += ls.length;
						ls2 = ls.sort().toString();
						ls2 = ls2.replace(regex, '$1,\n');
						if (ls.length > 0)
							exampleEmbed.addFields({ name: `Prime Frames (${ls.length} / ${primeFrames.length - ntst})`, value: ls2.replaceAll(',', ', ') });
						
						exampleEmbed.addFields({ name: `Total Frame Count`, value: `${count}` });
					}
					if (obj.sublist.length > 0)
					{
						var ls = obj.sublist;
						ls = ls.sort().toString();
						let n = 4;
						let ch = ',';

						let regex = new RegExp("((?:[^" +ch+ "]*" +ch+ "){" + (n-1) + "}[^" +ch+ "]*)" +ch, "g");

						ls = ls.replace(regex, '$1,\n');

						exampleEmbed.addFields({ name: `Subsumed Abilities (${obj.sublist.length} / ${regFrames.length})`, value: ls.replaceAll(',', ', ') });
					}
				}
				exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
				await interaction.reply({ embeds: [exampleEmbed] });
			}
			else
			{
				txt = (user) ? user + "'s " : "Your user ";
				interaction.reply({ content: `${txt}data does not exist! Please /register to create it!`, ephemeral: true })
			}
		}
		catch (err) {
			console.log(err);
		}
	}
};