const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd, alli, mrs } = require('../../config.json');
const { emb } = require('../../clanicons.json');
module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('View Simple Profile')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const user = interaction.targetUser;
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			colframes = dbo.collection("frames");
			const regFrames = await colframes.find({name: {$regex: '^[^ ]*$'}}).toArray();
			const primeFrames = await colframes.find({name: {$regex: '^.*[ ].*$'}}).toArray();
			const data = await collection.find({"id": user?.id}).toArray();
			if (data.length > 0) {
				let obj = await collection.find({"id": user?.id}).toArray();
				obj = obj[0];
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(`${obj.ign}'s Profile`)
					.setAuthor({ name: `${user?.displayName}`, iconURL: `${user?.displayAvatarURL()}` })
					.addFields(
					//{ name: `In-Game Name`, value: obj.ign, inline: true },
					{ name: `Mastery Rank`, value: ((obj.mr > 30 && obj.mr !== 69) ? "<:Legend:1197449912833560576>" + (obj.mr - 30) + ` (<:${obj.mr}_:${mrs[obj.mr][0]}>${mrs[obj.mr][1]})`: obj.mr + ` (<:${obj.mr}_:${mrs[obj.mr][0]}>${mrs[obj.mr][1]})`), inline: true },
					);
				if (obj.clan !== ""){
					exampleEmbed.addFields({ name: `Clan`, value: obj.clan, inline: true });
					exampleEmbed.setThumbnail(emb[obj.clan]);
				}
				exampleEmbed.addFields({ name: `Platform`, value: obj.platform, inline: true });
				if (obj.mains.length > 0)
					exampleEmbed.addFields({ name: `Main Frame${obj.mains.length > 1 ? "s " + "(" + obj.mains.length + ")" : ""}`, value: obj.mains.sort().toString().replaceAll(',', ', ') });
				exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
				await interaction.reply({ embeds: [exampleEmbed] });
			}
			else
			{
				txt = user.globalName + "'s ";
				interaction.reply({ content: `${txt}data does not exist! Please /register to create it!`, ephemeral: true })
			}
		}
		catch (err) {
			console.log(err);
		}
	}
};