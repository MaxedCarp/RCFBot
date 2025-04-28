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
		.setName('manageavailability')
		.setDescription('Manages the alts associated with your profile')
		.addSubcommand(subcommand =>
		subcommand
			.setName('add')
			.setDescription('Adds an alt to your profile')
			.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
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
                .setRequired(true))
				.addBooleanOption(option =>
            option.setName('connected')
                .setDescription('Specifies whether or not the alt is linked to the parent account.')
                .setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
			.setName('remove')
			.setDescription('Removes an alt from your profile')
			.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
			.setName('setplatform')
			.setDescription("Sets an alt's platform")
			.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
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
                .setRequired(true)))
			.addSubcommand(subcommand =>
			subcommand
			.setName('setconnected')
			.setDescription("Sets an alt's pairity field")
			.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true))
			.addBooleanOption(option =>
            option.setName('connected')
                .setDescription('The platform you play on.')
                .setRequired(true))),
	async execute(interaction) {
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		var dbo = ddb.db("warframe");
		collection = dbo.collection("users");
		const data = await collection.find({"id": interaction.user.id}).toArray();
		if (data.length > 0) {
			let obj = await collection.find({"id": interaction.user.id}).toArray();
			obj = obj[0];
			const sub = interaction.options.getSubcommand();
			await interaction.reply({ content: "NOT YET IMPLEMENTED!", ephemeral: true })
		}
		else
			await interaction.reply({ content: "You must create a profile first!", ephemeral: true });
	}
};