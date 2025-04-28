const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd } = require('../../config.json');
const { clientid, tsukiId, sublist, alli } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsubsumes')
		.setDescription('Add the listed subsumed abilities to your profile page')
		.addStringOption(option =>
            option.setName('subsumes')
                .setDescription('List of subsumed abilities (separated by a comma followed by a space)')
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
			try {
				var dbo = ddb.db("warframe");
				collection = dbo.collection("users");
				colframes = dbo.collection("frames");
				const data = await collection.find({"id": interaction.user.id}).toArray();
				if (data.length > 0) {
					let obj = await collection.find({"id": interaction.user.id}).toArray();
					obj = obj[0];
					const subl = interaction.options.getString('subsumes');
					const sublsplit = subl.toLowerCase().split(', ');
					var finalsubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0 && obj.sublist.indexOf(tttest[0].sub) === -1 && tttest[0].sub !== "none")
							await finalsubl.push(tttest[0].sub);
					}
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0 && obj.sublist.indexOf(tttest[0].sub) === -1 && tttest[0].sub !== "none")
							await finalsubl.push(tttest[0].sub);
					}
					finalsubl = uniq(finalsubl);
					var nonexistentsubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						var selector2 = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest2 = await colframes.find(selector2).toArray();
						if (tttest.length < 1 && tttest2.length < 1)
							await nonexistentsubl.push(sublsplit[i]);
					};
					nonexistentsubl = uniq(nonexistentsubl);
					var primesubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0  && tttest[0].sub === "none")
							await primesubl.push(sublsplit[i]);
					};
					primesubl = uniq(primesubl);
					var alrlistedsubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						var selector2 = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest2 = await colframes.find(selector2).toArray();
						if ((tttest.length > 0 || tttest2.length > 0) && (obj.sublist.indexOf(tttest[0]?.sub) !== -1 || obj.sublist.indexOf(tttest2[0]?.sub) !== -1))
							await alrlistedsubl.push(tttest[0]?.sub || tttest2[0]?.sub);
					};
					alrlistedsubl = uniq(alrlistedsubl);
					for (i = 0; i < finalsubl.length; i++){
					obj.sublist.push(finalsubl[i]);
					}
					uniq(obj.sublist.sort());
					const look = {"id": interaction.user.id};
					const test = { sublist: obj.sublist };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					if (finalsubl.length >= 1){
					var exampleEmbed = new EmbedBuilder()
						.setColor(0x69FA04)
						.setTitle(`The following subsumed abilities were added to your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
					exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						for (i = 0; i < finalsubl.length; i++){
							if (((i % 24) === 0) && i > 15){
								if (interaction.replied || interaction.deferred) {
									await interaction.followUp({ embeds: [exampleEmbed] });
								}
								else {
									await interaction.reply({ embeds: [exampleEmbed] });
								}
								exampleEmbed = new EmbedBuilder()
									.setColor(0x69FA04)
									.setTitle(`The following subsumed abilities were added to your profile:`)
									.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
								exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
							}
							exampleEmbed.addFields({ name: finalsubl[i], value: "Added!", inline: true });
						}
					await interaction.reply({ embeds: [exampleEmbed] });
					}
					if (nonexistentsubl.length >= 1 || alrlistedsubl.length >= 1 || primesubl.length >= 1){
						var exampleEmbed2 = new EmbedBuilder()
							.setColor(0xFF0000)
							.setTitle(`The following subsumed abilities were NOT added to your profile:`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
							.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						var f = 1;
						for (i = 0; i < nonexistentsubl.length; i++){
							if (((f % 22) === 0)){
								f = 1;
								if (interaction.replied || interaction.deferred) {
									await interaction.followUp({ embeds: [exampleEmbed2] });
								}
								else {
									await interaction.reply({ embeds: [exampleEmbed2] });
								}
								let exampleEmbed2 = new EmbedBuilder()
									.setColor(0xFF0000)
									.setTitle(`The following subsumed abilities were NOT added to your profile:`)
									.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
									.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
							}
							exampleEmbed2.addFields({ name: nonexistentsubl[i], value: "Does not exist!", inline: true });
							f++;
						}
						for (i = 0; i < alrlistedsubl.length; i++){
							if (((f % 24) === 0)){
								f = 1;
								if (interaction.replied || interaction.deferred) {
									await interaction.followUp({ embeds: [exampleEmbed2] });
								}
								else {
									await interaction.reply({ embeds: [exampleEmbed2] });
								}
								exampleEmbed2 = new EmbedBuilder()
									.setColor(0xFF0000)
									.setTitle(`The following subsumed abilities were NOT added to your profile:`)
									.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
									.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
							}
							exampleEmbed2.addFields({ name: alrlistedsubl[i], value: "Already in your profile!", inline: true });
							f++;
						}
						for (i = 0; i < primesubl.length; i++){
							if (((f % 24) === 0)){
								f = 1;
								if (interaction.replied || interaction.deferred) {
									await interaction.followUp({ embeds: [exampleEmbed2] });
								}
								else {
									await interaction.reply({ embeds: [exampleEmbed2] });
								}
								exampleEmbed2 = new EmbedBuilder()
									.setColor(0xFF0000)
									.setTitle(`The following subsumed abilities were NOT added to your profile:`)
									.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
									.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
							}
							exampleEmbed2.addFields({ name: primesubl[i], value: "Only regular frames have subsumable abilities!", inline: true });
							f++;
						}
						if (interaction.replied || interaction.deferred)
							await interaction.followUp({ embeds: [exampleEmbed2] });
						else
							await interaction.reply({ embeds: [exampleEmbed2] });
					}
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