const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd, alli } = require('../../config.json');
module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('View Alts')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const user = interaction.targetUser;
		if (interaction.channel.id !== "923290922010177616"){
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				const data = await collection.find({"id": user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": user.id}).toArray();
					obj = obj[0];
					if (obj.alts?.length > 0){
						const alts = obj.alts;
						const exampleEmbed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle(`${obj.ign}'s Alts:`)
						.setAuthor({ name: `${user.displayName}`, iconURL: `${user.displayAvatarURL()}` });
						alts.forEach(alt => {
						exampleEmbed.addFields({ name: alt.ign, value: "Platform: " + alt.platform + "\nConnected to Parent Account: " + (alt.isrelated ? "Yes" : "No"), inline: true });
						});
						await interaction.reply({ embeds: [exampleEmbed] });
						exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					}
					else
						interaction.reply({ content: "The specified user has no alts.", ephemeral: true });
				}
			}
			catch (err) {
				console.log(err);
			}
		}
	}
};