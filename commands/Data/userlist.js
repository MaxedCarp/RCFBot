const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Client } = require('discord.js');
const {MongoClient} = require('mongodb');
const { dbusr, dbpwd, alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('userlist')
		.setDescription('Prints a list of all regstered users'),
	async execute(interaction) {
		const ddb = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@127.0.0.1:29183`);
		try {
			var dbo = ddb.db("warframe");
			collection = dbo.collection("users");
			const dirs = await collection.find({}).toArray();
			let str, comb = "";
			var usrlist = [];
			let objtest = {};
			for (j = 0; j < dirs.length; j++) {
				obj = dirs[j];
				let usr = obj.id;
				if (obj.clan !== "") 
					str = `Mastery Rank: ${obj.mr}\nPlatform: ${obj.platform}\nClan: ${obj.clan}`;
				else
					str = `Mastery Rank: ${obj.mr}\nPlatform: ${obj.platform}`;
				exampleEmbed = new EmbedBuilder()
					.setColor(0x69FA04)
					.setTitle(`User List:`)
					.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
				let objtest = {};
				objtest["name"] = obj.ign;
				objtest["str"] = str;
				usrlist.push(objtest);
			};
			for (i = 0; i < usrlist.length; i++){
				if (((i % 24) === 0) && i > 15){
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({ embeds: [exampleEmbed], ephemeral:  true });
					}
					else {
						await interaction.reply({ embeds: [exampleEmbed], ephemeral:  true });
					}
					exampleEmbed = new EmbedBuilder()
					.setColor(0x69FA04);
				}
				exampleEmbed.addFields({ name: usrlist[i].name, value: usrlist[i].str, inline: true });
			}
			exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ embeds: [exampleEmbed], ephemeral:  true });
			}
			else {
				await interaction.reply({ embeds: [exampleEmbed], ephemeral:  true });
			}
		}
		catch (err) {
			console.log(err);
		}
	}
};