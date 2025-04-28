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
		.setName('managealts')
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
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			const data = await collection.find({"id": interaction.user.id}).toArray();
			if (data.length > 0) {
				let obj = await collection.find({"id": interaction.user.id}).toArray();
				obj = obj[0];
				const sub = interaction.options.getSubcommand();
				if (sub === "add") {
					const reg = /^[^ ]+#\d{3}$/;
					const reg2 = /^.+#\d{3}$/;
					const ign = interaction.options.getString('ign');
					if (ign.match(reg) || (ign.match(reg2) && platform === "xBox")){
						const platform = interaction.options.getString('platform');
						const isrelated = interaction.options.getBoolean('connected');
						const alt = { "ign": ign, "platform": platform, "isrelated": isrelated };
						if (!!obj["alts"].find(alt => alt.ign === ign)) {
							console.log('Alt "' + ign + '" already exists!');
						}
						else {
							obj["alts"].push(alt);
							const look = {"id": interaction.user.id};
							const test = { alts: obj.alts };
							const upd = { $set: test };
							const data = await collection.updateOne(look, upd);
							await interaction.reply({ content: 'Alt "' + ign + '" added to your profile!', ephemeral: true });
						}
					}
					else
						await interaction.reply({ content: 'Please make sure your username end with a hashtag and 3 digits as per your ingame profile!\n(For your in-game profile, hover your name in the top left and click "Profile")', ephemeral: true });
				}
				else if (sub === "remove"){
					const ign = interaction.options.getString('ign');
					if (!!obj["alts"].find(alt => alt.ign === ign)) {
						let alts = obj["alts"].filter(alt => alt.ign !== ign);
						obj["alts"] = alts;
						const look = {"id": interaction.user.id};
						const test = { alts: obj.alts };
						const upd = { $set: test };
						const data = await collection.updateOne(look, upd);
						await interaction.reply({ content: 'Alt "' + ign + '" removed!', ephemeral: true });
					}
					else {
						await interaction.reply({ content: 'Alt "' + ign + '" does not exist!', ephemeral: true });
					}
				}
				else if (sub === "setplatform"){
					const platform = interaction.options.getString('platform');
					const ign = interaction.options.getString('ign');
					const alt = obj.alts.find(altf => altf.ign === ign)
					if (!!alt) {
						alt.platform = platform;
						const look = {"id": interaction.user.id};
						const test = { alts: obj.alts };
						const upd = { $set: test };
						const data = await collection.updateOne(look, upd);
						await interaction.reply({ content: 'Alt "' + ign + '"\'s platform set to ' + platform + '!', ephemeral: true });
					}
					else {
						await interaction.reply({ content: 'Alt "' + ign + '" does not exist!', ephemeral: true });
					}
				}
				else if (sub === "setconnected"){
					const connected = interaction.options.getBoolean('connected');
					const ign = interaction.options.getString('ign');
					const alt = obj.alts.find(altf => altf.ign === ign)
					if (!!alt) {
						alt.isrelated = connected;
						const look = {"id": interaction.user.id};
						const test = { alts: obj.alts };
						const upd = { $set: test };
						const data = await collection.updateOne(look, upd);
						if (connected)
							await interaction.reply({ content: 'Alt "' + ign + '" is now paired to parent account!', ephemeral: true });
						else
							await interaction.reply({ content: 'Alt "' + ign + '" is now unpaired from parent account!', ephemeral: true });
					}
					else {
						await interaction.reply({ content: 'Alt "' + ign + '" does not exist!', ephemeral: true });
					}
				}
			}
			else
				await interaction.reply({ content: "You must create a profile first!", ephemeral: true });
		}
		catch (err) {
			console.log(err);
		}
	}
};