const { REST, Routes } = require('discord.js');
const { token, botIDs } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
//Grab all the command files from the commands directory
/*const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}*/

const pluginPath = path.join(__dirname, 'plugins');
const plugins = fs.readdirSync(pluginPath)
if(pluginPath && plugins) {
	for(const folder of plugins) {
		const pluginInfo = require(pluginPath+"/"+folder+"/plugin.json")
		if(pluginInfo.commands) {
			const pluginCommandsPath = pluginPath+"/"+folder+"/commands"
			const pluginCommandFiles = fs.readdirSync(pluginCommandsPath).filter(file => file.endsWith('.js'));
	
			for(const file of pluginCommandFiles) {
				//const filePath = path.join(pluginCommandsPath, file);
				const command = require(pluginCommandsPath+`/${file}`);
				console.log("Deploying command "+command.data.name)
				commands.push(command.data.toJSON());
			}
		}
	}
}

//Construct and prepare an instance of the REST module and deploy commands!
const rest = new REST({ version: '10'}).setToken(token);
(async () => {
	try {
		console.log(`Start refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(botIDs.client),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.log(error);
	}
})();
