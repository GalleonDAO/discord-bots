
const pino = require('pino');
const { AzureLoggingService } = require('../services/azureLoggingService');

const SERVICE_NAME = 'POWDER_MONKEY'; //TODO: replace this with KNOWN_SERVICE
const ENVIRONMENT = process.env.NODE_ENV;
class LogWrapper{
    #loggers = [];

    /**
     * Used to wrap Galleon's logging lib
     * formats inputs to standardised input and pushes to monitoring endpoint
     * @param {String} apiKey used to access Galleon logging endpoint
     * @param {LoggingOptions} loggingOptions 
     */
    constructor(loggingOptions){
        if(loggingOptions.CONSOLE_LOGGING)
            this.#loggers.push(this.#getFileLogger());
        if(loggingOptions.AZURE_LOGGING)
            this.#loggers.push(new AzureLoggingService(loggingOptions));
        if(loggingOptions.push(this.#getConsoleLogger()));
    }

    logMessage(severity, functionName, exception, message){
        const payload = {
            serviceName: SERVICE_NAME,
            environment: ENVIRONMENT,
            timestamp: new Date().toUTCString(),
            severity: severity,
            functionName: functionName,
            exception: exception,
            message: message
        };

        this.#loggers.forEach(logger => {
            logger.logMessage(payload);
        });
    }

    logCounter(commandName, metadata){
        const payload = {
            ServiceName: SERVICE_NAME,
            Environment: ENVIRONMENT,
            label: commandName,
            metadata: metadata
        }
        this.#loggers.forEach(logger => {
            logger.logCounter(payload);
        });
    }

    logTimer(commandName, duration){
        const payload = {
            ServiceName: SERVICE_NAME,
            Environment: ENVIRONMENT,
            label: commandName,
            duration: duration
        };

        this.#loggers.forEach(logger => {
            logger.logTimer(payload);
        });
    }

    #getFileLogger(){
        return {
            transport: pino.transport({
                target: 'pino/file',
                options: { destination: './log.json'}
            }),
            logger: pino(this.transport),
            logMessage: (payload) =>{
                this.logger.error(payload);
            },
            logCounter: (payload) =>{
                this.logger.info(payload);
            },
            logTimer: (payload) =>{
                this.logger.info(payload);
            }
        }
    }

    #getConsoleLogger(){
        return {
            logMessage: (payload) =>{
                console.error(payload);
            },
            logCounter: (payload) =>{
                console.log(payload);
            },
            logTimer: (payload) =>{
                console.log(payload);
            }
        }
    }
}

module.exports = { LogWrapper };

/**
 * @typedef {Object} LoggingOptions
 * @property {AzureLoggingOptions} azureLoggingOptions
 * @property {FileLoggingOptions} fileLoggingOptions
 * @property {ConsoleLoggingOptions} consoleLoggingOptions
 */

/**
 * @typedef {Object} AzureLoggingOptions
 * @property {boolean} ENABLED
 * @property {string} API_KEY
 * @property {string} MONITORING_URL
 * @property {string} LOGS_ENDPOINT
 * @property {string} COUNTERS_ENDPOINT
 * @property {string} TIMERS_ENDPOINT
 */

/**
 * @typedef {Object} FileLoggingOptions
 * @property {boolean} ENABLED
 * @property {string} FILE_PATH
 */

/**
 * @typedef {Object} ConsoleLoggingOptions
 * @property {boolean} ENABLED
 */