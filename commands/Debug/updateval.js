const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const fs = require('node:fs');

async function test(user){
	const usr = JSON.parse(await fs2.readFile(path.join(__dirname, '../../../../wfbots/userdata', user)));
	return usr;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updateval')
		.setDescription('Updates values'),
	async execute(interaction) {
		if (interaction.user.id !== "275305152842301440")
			return;
		const registeredc = await fs2.readdir(path.join(__dirname, "../../../../wfbots/userdata/"));
		console.log(registeredc);
		registeredc.forEach(user => {
			let obj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../wfbots/userdata', user)));
			if (obj.alts?.length > -1){
				console.log(user + " has alts field");
			}
			else{
				console.log(user + " does not have alts field");
				obj.alts = [];
				fs.writeFileSync(path.join(__dirname, '../../../../wfbots/userdata', user), JSON.stringify(obj, null, "\t"));
			}
		});
	}
};