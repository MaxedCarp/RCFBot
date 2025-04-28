const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd } = require('../../config.json');
const { clientid, tsukiId, alli, framelist } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeframes')
		.setDescription('Removes the listed frames from your profile page')
		.addStringOption(option =>
            option.setName('frames')
                .setDescription('List of frames (separated by a command and a space)')
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
					const framel = interaction.options.getString('frames');
					const framelsplit = framel.split(', ');
					var finalframel = [];
					for (i = 0; i < framelsplit.length; i++){
						var selector = {name: {$regex: '^' + framelsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0 && obj.framelist.indexOf(tttest[0].name) !== -1)
							await finalframel.push(tttest[0].name);
					}
					finalframel = uniq(finalframel.sort());
					var notlistedframel = [];
					for (i = 0; i < framelsplit.length; i++){
						var selector = {name: {$regex: '^' + framelsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length > 0 && obj.framelist.indexOf(tttest[0].name) === -1)
							await notlistedframel.push(tttest[0].name);
					};
					notlistedframel = uniq(notlistedframel.sort());
					var nonexistentframel = [];
					for (i = 0; i < framelsplit.length; i++){
						var selector = {name: {$regex: '^' + framelsplit[i] + '$', $options:"i"}};
						var tttest = await colframes.find(selector).toArray();
						if (tttest.length < 1)
							await nonexistentframel.push(framelsplit[i]);
					};
					nonexistentframel = uniq(nonexistentframel.sort());
					for (i = 0; i < finalframel.length; i++){
						obj.framelist = obj.framelist.filter(a => a !== finalframel[i]);
					}
					uniq(obj.framelist.sort());
					const look = {"id": interaction.user.id};
					const test = { framelist: obj.framelist };
					const upd = { $set: test };
					const data = await collection.updateOne(look, upd);
					if (finalframel.length >= 1){
						const exampleEmbed = new EmbedBuilder()
							.setColor(0x69FA04)
							.setTitle(`The following frames were removed from your profile:`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
						exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						for (i = 0; i < finalframel.length; i++){
							exampleEmbed.addFields({ name: finalframel[i], value: "Removed!", inline: true });
						}
						await interaction.reply({ embeds: [exampleEmbed] });
					}
					if (nonexistentframel.length > 0 || notlistedframel.length > 0){
						const exampleEmbed2 = new EmbedBuilder()
							.setColor(0xFF0000)
							.setTitle(`The following frames were NOT removed from your profile:`)
							.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
						exampleEmbed2.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
						if (nonexistentframel.length >= 1){
							for (i = 0; i < nonexistentframel.length; i++){
								exampleEmbed2.addFields({ name: nonexistentframel[i], value: "This frame doesn't exist!", inline: true });
							}
						}
						if (notlistedframel.length > 0){
							for (i = 0; i < notlistedframel.length; i++){
								exampleEmbed2.addFields({ name: notlistedframel[i], value: "This frame is not in your profile!", inline: true });
							}
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