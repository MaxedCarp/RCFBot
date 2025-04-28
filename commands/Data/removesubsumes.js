const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd } = require('../../config.json');
const { clientid, tsukiId, alli, sublist } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removesubsumes')
		.setDescription('Removes the listed subsumed abilities from your profile page')
		.addStringOption(option =>
            option.setName('subsumes')
                .setDescription('List of subsumed abilities (separated by a command and a space)')
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
						if (tttest.length > 0 && obj.sublist.indexOf(tttest[0].sub) !== -1)
							await finalsubl.push(tttest[0].sub);
					}
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0 && obj.sublist.indexOf(tttest[0].sub) !== -1)
							await finalsubl.push(tttest[0].sub);
					}
					finalsubl = uniq(finalsubl.sort());
					var notlistedsubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						var selector2 = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest2 = await colframes.find(selector2).toArray();
						if ((tttest.length > 0 || tttest2.length > 0 && (obj.sublist.indexOf(tttest[0]?.sub) === -1 || obj.sublist.indexOf(tttest2[0]?.sub) === -1)))
							if (tttest[0]?.sub !== "none" && tttest2[0]?.sub !== "none")
								await notlistedsubl.push(tttest[0]?.sub || tttest2[0]?.sub);
					};
					notlistedsubl = uniq(notlistedsubl.sort());
					var primesubl = []
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						var selector2 = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest2 = await colframes.find(selector2).toArray();
						if ((tttest.length > 0 || tttest2.length > 0 && (tttest[0]?.sub === "none" || tttest2[0]?.sub === "none")))
							await notlistedsubl.push(sublsplit[i]);
					};
					primesubl = uniq(primesubl.sort());
					var nonexistentsubl = [];
					for (i = 0; i < sublsplit.length; i++){
						var selector = {sub: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						var selector2 = {name: {$regex: '^' + sublsplit[i] + '$', $options:"i"}};
						var tttest2 = await colframes.find(selector2).toArray();
						if (tttest.length < 1 && tttest2.length < 1)
							await nonexistentsubl.push(sublsplit[i]);
					};
					nonexistentsubl = uniq(nonexistentsubl.sort());
					for (i = 0; i < finalsubl.length; i++){
						obj.sublist = obj.sublist.filter(a => a !== finalsubl[i]);
					}
					uniq(obj.sublist.sort());
					const look = {"id": interaction.user.id};
					const test = { sublist: obj.sublist };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					if (finalsubl.length >= 1){
						const exampleEmbed = new EmbedBuilder()
							.setColor(0x69FA04)
							.setTitle(`The following subsumed abilities were removed from your profile:`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
						exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						for (i = 0; i < finalsubl.length; i++){
							exampleEmbed.addFields({ name: finalsubl[i], value: "Removed!", inline: true });
						}
						await interaction.reply({ embeds: [exampleEmbed] });
					}
					if (nonexistentsubl.length >= 1 || notlistedsubl.length >= 1 || primesubl.length >= 1){
						const exampleEmbed2 = new EmbedBuilder()
							.setColor(0xFF0000)
							.setTitle(`The following subsumed abilities were NOT removed from your profile:`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
						exampleEmbed2.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						for (i = 0; i < nonexistentsubl.length; i++){
							exampleEmbed2.addFields({ name: nonexistentsubl[i], value: "This subumed ability or frame don't exist!", inline: true });
						}
						for (i = 0; i < notlistedsubl.length; i++){
							exampleEmbed2.addFields({ name: notlistedsubl[i], value: "This subumed ability isn't in your profile!", inline: true });
						}
						for (i = 0; i < primesubl.length; i++){
							exampleEmbed2.addFields({ name: primesubl[i], value: "Primed warframes can not be subsumed!", inline: true });
						}
						if (interaction.replied || interaction.deferred){
							await interaction.followUp({ embeds: [exampleEmbed2] });
						}
						else
							await interaction.reply({ embeds: [exampleEmbed2] });
					}
				}
				else
					interaction.reply({ content: "You need to register first!", ephemeral: true });
			}
			catch (err) {
				console.log(err);
			}
		}
	}
};