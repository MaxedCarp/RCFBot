const { REST, Routes } = require('discord.js');
const { clientid, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const foldersArray = [foldersPath];

foldersArray.forEach(fp => {
	let commandFolders = fs.readdirSync(fp);
	for (let folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	let commandsPath = path.join(fp, folder);
	let commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (let file of commandFiles) {
		let filePath = path.join(commandsPath, file);
		let command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started updating ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientid),
			{ body: commands },
		);

		console.log(`Successfully updated ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();