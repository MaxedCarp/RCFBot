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
		.setName('setplatform')
		.setDescription('Sets your platform.')
		.addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play on.')
				.addChoices(
                    { name: 'PC', value: 'PC' },
                    { name: 'Playstation', value: 'Playstation' },
                    { name: 'XBox', value: 'XBox' },
                    { name: 'Switch', value: 'Switch' },
                )
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const plat = interaction.options.getString('platform');
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				const data = await collection.find({"id": interaction.user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": interaction.user.id}).toArray();
					obj = obj[0];
					obj.platform = plat;
					const look = {"id": interaction.user.id};
					const test = { platform: obj.platform };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					await interaction.reply( { content: `Your Platform has been successfully set to: ${obj.platform}!`, ephemeral: true} );
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
	}
};