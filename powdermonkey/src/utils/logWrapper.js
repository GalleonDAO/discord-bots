
const pino = require('pino');

const SERVICE_NAME = 'POWDER_MONKEY'; //TODO: replace this with KNOWN_SERVICE
const ENVIRONMENT = process.env.NODE_ENV;
class LogWrapper{
    #logger;

    /**
     * Used to wrap Galleon's logging lib
     * formats inputs to standardised input and pushes to monitoring endpoint
     * @param {String} apiKey used to access Galleon logging endpoint 
     */
    constructor(apiKey){
        const transport = pino.transport({
            target: 'pino/file',
            options: { destination: './log.json'}
        });
        this.#logger = pino(transport);
    }

    logMessage(){
        throw new Error('Not Implemented');
    }

    logCounter(commandName, metadata){
        this.#logger.info({
            ServiceName: SERVICE_NAME,
            Environment: ENVIRONMENT,
            label: commandName,
            metadata: metadata
        });

        // logger.logCounter(`${interaction.member.displayName} used /${interaction.commandName} ${interaction.options.data[0]? `with params ${interaction.options.data[0].name}: ${interaction.options.data[0].value}`: ''}`)
    }

    logTimer(commandName, duration){
        this.#logger.info({
            ServiceName: SERVICE_NAME,
            Environment: ENVIRONMENT,
            label: commandName,
            duration: duration
        })
        throw new Error('Not Implemented');
    }
}

module.exports = { LogWrapper };