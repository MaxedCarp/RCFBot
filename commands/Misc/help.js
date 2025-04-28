const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { alli } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Prints out the list of commands'),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const exampleEmbed = new EmbedBuilder()
				.setColor(0x00A012)
				.setTitle(`Command List`)
				.setAuthor({
					name: `Help Form`, iconURL: `https://cdn.discordapp.com/avatars/1159269824908763168/c7dea1fa4fb17583d6c8dc8d1068be59.png`
				})
				.setDescription("<text> - Parameter\n(<text> <text>...) - Optional parameter(s)\n()... - Unlimited optional parameters.")
				.addFields(
					{ name: 'Users', value: "----------------" },
					{ name: '/register <in-game name> <mastery rank> <platform>', value: "Registers the user:\n- The in-game name must include your tag / discriminator.\n- Can only be used in the registration channel." },
					{ name: '/unregister', value: "- Deletes your user data." },
					{ name: '/profile (<user>)', value: "- Prints out your profile or the selected user's profile." },
					{ name: 'Data', value: "----------------" },
					{ name: '/setign <in-game name>', value: "- Sets your in-game name (in case you mistyped it or changed it)." },
					{ name: '/setmr <mastery rank>', value: "- Sets your mastery rank." },
					{ name: '/setplatform <platform>', value: "- Sets your platform (might only be useful once crossplay drops)." },
					{ name: '/addframes <frame>(, <frame>)...', value: "- Adds the specified frames to your profile (for more than one frame, you need to separate them with a comma followed by a space)." },
					{ name: '/removeframes <frame>(, <frame>)...', value: "- Removes the specified frames from your profile (for more than one frame, you need to separate them with a comma followed by a space)." },
					{ name: '/addsubsumes <ability>(, <ability>)...', value: "- Adds the specified subsumed abilities to your profile (for more than one ability, you need to separate them with a comma followed by a space)." },
					{ name: '/removesubsumes <ability>(, <ability>)...', value: "- Removes the specified subsumed abilities from your profile (for more than one ability, you need to separate them with a comma followed by a space)." },
					{ name: '/setmains <frame>(, <frame>)...', value: "- Sets your main frame(s) (for more than one frame, you need to separate them with a comma followed by a space)." },
					{ name: 'Roles', value: "----------------" },
					{ name: '/toggle spoilers', value: "- Shows or hides the spoilers channel." },
					{ name: '/toggle leaks', value: "- Shows or hides the leaks channel." },
					{ name: 'Misc', value: "----------------" },
					{ name: '/help', value: "- Displays this help form" }
				);
			exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
			await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
		}
	}
};