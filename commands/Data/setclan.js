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
		.setName('setclan')
		.setDescription('Sets your platform.')
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
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const clan = interaction.options.getString('clan');
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				const data = await collection.find({"id": interaction.user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": interaction.user.id}).toArray();
					obj = obj[0];
					obj.clan = clan;
					const look = {"id": interaction.user.id};
					const test = { clan: obj.clan };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					await interaction.reply( { content: `Your Clan has been successfully set to: ${obj.clan}!`, ephemeral: true} );
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