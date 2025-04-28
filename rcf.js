const { Client, Collection, Events, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { REST, Routes } = require('discord.js');
const fs2 = require('./fsfuncs');
const fs = require('fs');
const path = require('node:path');
const { dbusr, dbpwd, clientid, token, addr, activedb } = require('./config.json');
const {MongoClient} = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Channel, Partials.Message, Partials.Reaction] });
fetched = false;
client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	await client.user.setPresence({ activities: [{ name: `Bot started up!`, type: ActivityType.Custom }], status: 'dnd' });
	global.client = client;
	global.connections = {};
	global.mongo = await MongoClient.connect(`mongodb://${dbusr}:${dbpwd}@${addr}`);
	global.db = global.mongo.db("warframe");
	global.users = db.collection("users");
	eventEmitter.emit('keepAlive');
	await sleep(3);
	while (true){
		await client.user.setPresence({ activities: [{ name: `527677 Pistol Riven Mods with Dargyn challenges obtained!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(3);
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		const data = await global.users.find({}).toArray();
		await client.user.setPresence({ activities: [{ name: `Registered Users: ${data.length}`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
		let guilds = client.guilds.cache.filter(guilda => guilda.id !== "603685659797880832")
		let mC = guilds.map(guild => guild.memberCount).reduce((a, b) => a + b, 0)
		await client.user.setPresence({ activities: [{ name: `${mC} members in the server!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
		await client.user.setPresence({ activities: [{ name: `/profile to view your profile`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
		await client.user.setPresence({ activities: [{ name: `Alliance Discord: https://discord.gg/7DjdXDQRKf`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
		await client.user.setPresence({ activities: [{ name: `Bot by @MaxedCarp!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
		await client.user.setPresence({ activities: [{ name: `Uptime: ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(10);
	}
});

async function UpdateKeep_Alive(){
	global.mongo.db("global").collection("availability").updateOne({name: activedb}, { $set: {lastreported: Math.floor(Math.floor(new Date().valueOf() / 1000)), uptime: client.uptime } });
}

let keep_alive = function () {
	setInterval(UpdateKeep_Alive, 5000);
}

eventEmitter.on('keepAlive', keep_alive);

function getArgs(obj){
	if (obj.type === 3){
		return {name: obj.name, val: obj.value};
	}
	else if (obj.type === 4){
		return {name: obj.name, val: obj.value};
	}
	else if (obj.type === 5){
		return {name: obj.name, val: obj.value};
	}
	else if (obj.type === 6)
	{
		return {name: obj.name, val: obj.user.username};
	}
	else if (obj.type === 7)
	{
		return {name: obj.name, val: `<#${obj.channel.id}>`};
	}
	else if (obj.type === 8)
	{
		return {name: obj.name, val: `Role Name: ${obj.role.name}.\nRole ID: ${obj.role.id}`};
	}
	else if (obj.type === 9)
	{
		return {name: obj.name, val: obj.user.username};
	}
	else if (obj.type === 10)
	{
		return {name: obj.name, val: obj.value};
	}
	else if (obj.type === 11)
	{
		return {name: obj.name, val: `Attachment Type: ${obj.attachment.contentType}.\nName: ${obj.attachment.name}.\nAttachment URL: ${obj.attachment.url}`};
	}
}
client.login(token);

client.commands = new Collection();
function sleep(seconds) {
  return new Promise(r => setTimeout(r, seconds * 1000))
}
const foldersPath = path.join(__dirname, 'commands');
const foldersArray = [foldersPath];

foldersArray.forEach(fp => {
	let commandFolders = fs.readdirSync(fp);

	for (const folder of commandFolders) {
		const commandsPath = path.join(fp, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
});
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.guild.id !== "621701090940944384")
		return;
	if (interaction.isChatInputCommand()) {

		const command = interaction.client.commands.get(interaction.commandName);
		//console.log(interaction);
		const args = interaction.options["_hoistedOptions"];
		var argArr = []
		if (args.length > 0) {
			args?.forEach(arg => argArr.push(getArgs(arg)));
			//console.log(argArr);
			//console.log(args);
		}
		const sub = (interaction.options["_subcommand"] ? " " + interaction.options["_subcommand"] : "");
		const exampleEmbed = new EmbedBuilder()
			.setColor(0xf7ef02)
			.setTitle(`Command Created: ${command.data.name}${sub}`)
			.setAuthor({ name: `${interaction.user.globalName} (${interaction.user.username})`, iconURL: interaction.member.displayAvatarURL() })
			.setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
			/*.setDescription(`Used By: "${interaction.member.globalName}" (${interaction.member})`)
			*/.setFooter({ text: 'Raging Catfish', iconURL: "https://maxedcarp.net/imgs/rcf.png" });
		if (argArr.length > 0){
			var str = ""
			for (i = 0; i < argArr.length; i++) {
				str+= `${i + 1}. ${argArr[i].name}:\n${argArr[i].val}\n`;
			}
			exampleEmbed.setDescription(str);
		}
		await client.channels.cache.get("1160725332958134344").send({ embeds: [exampleEmbed] });
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'This interaction was already replied to!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
	else if (interaction.isUserContextMenuCommand()){
		const { username } = interaction.targetUser;
		const command = interaction.client.commands.get(interaction.commandName);
		
		const exampleEmbed = new EmbedBuilder()
			.setColor(0xf7ef02)
			.setTitle(`Command Created: ${command.data.name} (User Context Menu Command)`)
			.setAuthor({ name: `${interaction.user.globalName} (${interaction.user.username})`, iconURL: interaction.member.displayAvatarURL() })
			.setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
			.setFooter({ text: 'Raging Catfish', iconURL: "https://maxedcarp.net/imgs/rcf.png" });
		exampleEmbed.setDescription("Target User: " + username);
		await client.channels.cache.get("1160725332958134344").send({ embeds: [exampleEmbed] });
				
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'This interaction was already replied to!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
});
client.on(Events.MessageCreate, async (message) => {
	if (message.guild.id !== "621701090940944384")
		return;
	if (message.channel.id == "923290922010177616" && message.author.id != clientid){
		console.log("yeet");
		await message.delete();
	}
	if (message.author.id === "1125528327675969566" || message.author.id === "1164994671785824307"){
		console.log('Discord "System message" Deleted!');
		await client.channels.cache.get("1160329316907880518").send('Discord "System message" Deleted!');
		await message.delete();
	}
	if (message.content.includes('~!@') && (message.author.id === "275305152842301440" || message.author.id === "373119910714277891")){
		var testt = "true";
		try {
			var repliedTo = await message.fetchReference();
		}
		catch(err)
		{ 
			var testt = "false"; 
		}
		if (testt){
			const react = message.content.substring(4);
			console.log(react);
			repliedTo.react(react);
			await message.delete()
		}
	}
	if (message.author.id === "1162578114308735018"){
		message.reply("||<@&1162577500833063062>||")
	}
	if (message.author.id === "1178993386666070057" && message.channel.id === "1175682999220711496"){
		message.reply("||<@&1175708474018111488>||")
	}
	try{
		const { guild } = message;
		const member = guild.members.cache.find(member => member.id === message.author.id);
		const role = guild.roles.cache.find(role => role.name === 'Member');
		if (message.channel.id === "1163649027905159298" || message.channel.id === "1163648828315013230" || message.channel.id === "1158851292270186496"){
			if (!!!member.roles.cache.has(role.id))
				await message.delete();
		}
	} catch (err)
	{
		console.log(err);
	}
});
client.on(Events.GuildMemberAdd, async (member) => {
	if (member?.guild?.id !== "621701090940944384")
		return;
	const data = await global.users.find({"id": member.id}).toArray();
	if (data.length > 0){
		const { guild } = member;
		const member2 = guild.members.cache.find(member2 => member2.id === member.id);
		const role = guild.roles.cache.find(role => role.name === 'Member');
		const role2 = guild.roles.cache.find(role2 => role2.name === 'Salmon');
		await member2.roles.add(role);
		await member2.roles.add(role2);
	}
});