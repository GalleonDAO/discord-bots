
const pino = require('pino');
const { AzureLoggingService } = require('../services/azureLoggingService');

const SERVICE_NAME = 'POWDER_MONKEY'; //TODO: replace this with KNOWN_SERVICE
class LogWrapper{
    #loggers = [];
    #ENVIRONMENT;

    /**
     * Used to wrap Galleon's logging lib
     * formats inputs to standardised input and pushes to monitoring endpoint
     * @param {String} apiKey used to access Galleon logging endpoint
     * @param {LoggingOptions} loggingOptions 
     */
    constructor(loggingOptions){
        this.#ENVIRONMENT = process.env.NODE_ENV;
        if(loggingOptions?.fileLoggingOptions.ENABLED){
            console.log("Adding File Logger");
            this.#loggers.push(this.#getFileLogger(loggingOptions.fileLoggingOptions));
            console.log("File Logging Enabled");
        }
        if(loggingOptions?.azureLoggingOptions.ENABLED){
            console.log("Adding Azure Logger")
            this.#loggers.push(new AzureLoggingService(loggingOptions.azureLoggingOptions));
            console.log("Azure Logging Enabled");
        }
        if(loggingOptions?.consoleLoggingOptions.ENABLED){
            this.#loggers.push(this.#getConsoleLogger(loggingOptions.consoleLoggingOptions));
            console.log("Enabled Console Logging");
        }
    }

    logMessage(severity, functionName, exception, message){
        const payload = {
            serviceName: SERVICE_NAME,
            environment: this.#ENVIRONMENT,
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
            serviceName: SERVICE_NAME,
            environment: this.#ENVIRONMENT,
            label: commandName,
            metadata: metadata
        }
        this.#loggers.forEach(logger => {
            logger.logCounter(payload);
        });
    }

    logTimer(commandName, duration){
        const payload = {
            serviceName: SERVICE_NAME,
            environment: this.#ENVIRONMENT,
            label: commandName,
            duration: duration
        };

        this.#loggers.forEach(logger => {
            logger.logTimer(payload);
        });
    }

    /**
     * 
     * @param {FileLoggingOptions} fileLoggingOptions 
     * @returns 
     */
    #getFileLogger(fileLoggingOptions){
        const transport = pino.transport({
            target: 'pino/file',
            options: { destination: fileLoggingOptions.FILE_PATH}
        });
        
        const fileLogger = {
            logger: pino(transport),
            logMessage: (payload) =>{
                fileLogger.logger.error(payload);
            },
            logCounter: (payload) =>{
                fileLogger.logger.info(payload);
            },
            logTimer: (payload) =>{
                fileLogger.logger.info(payload);
            }
        };

        return fileLogger;
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