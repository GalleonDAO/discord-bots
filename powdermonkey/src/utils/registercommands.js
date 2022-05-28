const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');

module.exports.registerApplicationCommands = async (API_TOKEN, CLIENT_ID, GUILD_ID, commands) => {
    const commandsData = [];

    commands.forEach(command => {
        console.log(`Adding Command: ${command.data.name}`)
        commandsData.push(command.data.toJSON());
    });

    const rest = new REST({
        version: '9'
    }).setToken(API_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                body: commandsData
            },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};