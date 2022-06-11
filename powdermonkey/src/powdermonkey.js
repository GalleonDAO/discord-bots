const { registerApplicationCommands } = require ('./utils/registercommands');
const { Client, Collection, Intents } = require('discord.js');
const { ServiceContainer } = require('./services/serviceContainer');
const { DiscordInteractionHandler } = require('./utils/discordInteractionHandler');
const { KNOWN_LABELS, LOG_SEVERITY} = require('./services/azureLoggingService');

const serviceContainer = new ServiceContainer();

const DISCORD_API_TOKEN = serviceContainer.getConfigurationOption('DISCORD_API_TOKEN');
const CLIENT_ID = serviceContainer.getConfigurationOption('APPLICATION_ID');
const GUILD_ID = serviceContainer.getConfigurationOption('GUILD_ID');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

/**
 * @type {import('./utils/logWrapper.js').LogWrapper}
 */
const logger = serviceContainer.getService('logger');

client.commands = new Collection();

for (const key of serviceContainer.getCommandsList()){
	const command = serviceContainer.getCommand(key);
	client.commands.set(command.data.name, command);
}

client.commands = serviceContainer.configureHelpCommand(client.commands);

client.login(DISCORD_API_TOKEN)
client.once('ready', () => {
    console.log(`Bot successfully started as ${client.user.tag} 🤖`);
    registerCommands();
	if (client.user) {
		client.user.setActivity(
			"/help", {
			type: 'PLAYING'
		});
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	const interactionHandler = new DiscordInteractionHandler(interaction, logger);
	try {
		logger.logCounter(KNOWN_LABELS.COMMAND_USED, {
			command: interaction.commandName,
			username: interaction.member.displayName,
			subcommand: interaction.options._subcommand? interaction.options._subcommand: 'none',
			[interaction.options.data[0]? interaction.options.data[0].name : 'params']: interaction.options.data[0]? interaction.options.data[0].value: 'none'
		});

		await command.execute(interactionHandler);
	} 
	catch (error) {
		logger.logMessage(LOG_SEVERITY.ERROR, 'interactionCreate', error.stack, error.message);
		await interactionHandler.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const registerCommands = async () => {
    // client.guilds.cache.forEach(async (guild) => {
	await registerApplicationCommands(DISCORD_API_TOKEN, CLIENT_ID, GUILD_ID, client.commands);
    // })
};