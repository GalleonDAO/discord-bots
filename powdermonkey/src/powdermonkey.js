const { registerApplicationCommands } = require ('./utils/registercommands');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const { ServiceContainer } = require('./services/serviceContainer');
const { DiscordInteractionHandler } = require('./utils/discordInteractionHandler');

dotenv.config();

const DISCORD_API_TOKEN = process.env.DISCORD_API_TOKEN
const CLIENT_ID = process.env.APPLICATION_ID
const GUILD_ID = process.env.GUILD_ID

const serviceContainer = new ServiceContainer();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] })

client.commands = new Collection();

for (const key of serviceContainer.getCommandsList()){
	const command = serviceContainer.getCommand(key);
	client.commands.set(command.data.name, command);
}

client.login(DISCORD_API_TOKEN)
client.once('ready', () => {
    console.log(`Bot successfully started as ${client.user.tag} 🤖`);
    registerCommands();
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(new DiscordInteractionHandler(interaction));
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const registerCommands = async () => {
    // client.guilds.cache.forEach(async (guild) => {
	await registerApplicationCommands(DISCORD_API_TOKEN, CLIENT_ID, GUILD_ID, client.commands);
    // })
};