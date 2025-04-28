const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dbusr, dbpwd } = require('../../config.json');
const {MongoClient} = require('mongodb');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unregister')
		.setDescription('Deletes your user data'),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			const data = await collection.find({"id": interaction.user.id}).toArray();
			if (data.length > 0) { // verifying presence of the user data
				dbo.collection("users").deleteOne({"id": interaction.user.id});
				await interaction.reply({ content: "Your user data has been successfully deleted!", ephemeral: true });
			}
			else
			{
				await interaction.reply({ content: "Your user data does not exist so we could not delete it!", ephemeral: true });
			}
		}
	}
};