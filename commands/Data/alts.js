const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd } = require('../../config.json');
const { clientid, tsukiId, framelist, alli } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('alts')
		.setDescription('Displays a user\'s alt list')
		.addUserOption(option =>
            option.setName('user')
                .setDescription('User to display')),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		if (interaction.channel.id !== "923290922010177616"){
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				const data = await collection.find({"id": user.id || interaction.user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": user.id || interaction.user.id}).toArray();
					obj = obj[0];
					if (obj.alts?.length > 0){
						const alts = obj.alts;
						const exampleEmbed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle(`${obj.ign}'s Alts:`)
						.setAuthor({ name: `${(user?.displayName || interaction.user.displayName)}`, iconURL: `${(user?.displayAvatarURL() || interaction.member.displayAvatarURL())}` });
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