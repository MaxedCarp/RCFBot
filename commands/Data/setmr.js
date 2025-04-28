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
		.setName('setmr')
		.setDescription('Sets your Mastery Rank level.')
		.addIntegerOption(option =>
            option.setName('mr')
                .setDescription('Your in-game Mastery Rank.')
                .setRequired(true)),
	async execute(interaction) {
		const mr = interaction.options.getInteger('mr');
		if (mr < 36 && mr > -1){
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				const data = await collection.find({"id": interaction.user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": interaction.user.id}).toArray();
					obj = obj[0];
					obj.mr = mr;
					const look = {"id": interaction.user.id};
					const test = { mr: obj.mr };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					await interaction.reply( { content: `Your Mastery Rank has been successfully set to: ${obj.mr}!`, ephemeral: true} );
				}
				else
				{
					interaction.reply({ content: "You need to register first!", ephemeral: true });
				}
			}
			catch (err) {
				console.log(err);
			}
		}
		else
			interaction.reply({ content: 'Specified Mastery Rank has to be between 0 and 36!', ephemeral: true });
	}
};