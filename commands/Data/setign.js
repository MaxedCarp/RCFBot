const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setign')
		.setDescription('Sets your In-Game name.')
		.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true)),
	async execute(interaction) {
		const reg = /^[^ ]+#\d{3}$/;
		const reg2 = /^.+#\d{3}$/;
		const ign = interaction.options.getString('ign');
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			const data = await collection.find({"id": interaction.user.id}).toArray();
			if (data.length > 0) {
				let obj = await collection.find({"id": interaction.user.id}).toArray();
				obj = obj[0];
				if (ign.match(reg) || (ign.match(reg2) && obj.platform === "xBox")){
					obj.ign = ign;
					const look = {"id": interaction.user.id};
					const test = { ign: obj.ign };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					await interaction.reply( { content: `Your in-game name has been successfully set to: ${obj.ign}!`, ephemeral: true} );
				}
				else
				{
					interaction.reply({ content: 'Please make sure your username end with a hashtag and 3 digits as per your ingame profile!\n(For your in-game profile, hover your name in the top left and click "Profile")', ephemeral: true });
				}
			}
			else
				interaction.reply({ content: 'You need to register first!', ephemeral: true });
		}
		catch (err) {
			console.log(err);
		}
	}
};