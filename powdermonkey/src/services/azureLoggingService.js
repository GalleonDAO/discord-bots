const fetch = require('node-fetch');
const { Headers } = require('node-fetch');

const HEADER_KEYS = {
    SUBSCRIPTION: 'Ocp-Apim-Subscription-Key',
    TRACE: 'Ocp-Apim-Trace'
};
const LOG_SEVERITY = {
    DEBUG: 'Debug',
    INFO: 'Info',
    WARN: 'Warn',
    ERROR: 'Error',
    FATAL: 'Fatal'
};
const KNOWN_LABELS ={
    COMMAND_USED: 'COMMAND USED'
};
const KNOWN_SERVICES = {
    POWDER_MONKEY: 'POWDER_MONKEY'
};

class AzureLoggingService{
    #loggingOptions;
    #headers;

    /**
     * Service to connect and log to Galleon's azure monitoring
     * @param {AzureLoggingOptions} loggingOptions
     */
    constructor(loggingOptions){
        this.#loggingOptions = loggingOptions;
        this.#headers = new Headers({
            [HEADER_KEYS.SUBSCRIPTION] : loggingOptions.API_KEY,
            [HEADER_KEYS.TRACE] : true,
            'Content-Type' : "application/json"
        });
    }

    /**
     * 
     * @param {MessagePayload} messagePayload 
     */
    async logMessage(payload){
        const loggerUrl = this.#loggingOptions.MONITORING_URL + this.#loggingOptions.LOGS_ENDPOINT
        return await fetch(loggerUrl, {
          method: 'POST',
          headers: this.#headers,
          body: JSON.stringify({
            ServiceName: payload.serviceName,
            Environment: payload.environment,
            TimeStamp: payload.timestamp,
            Severity: payload.severity,
            FunctionName: payload.functionName,
            Exception: payload.exception,
            Message: payload.message,
            CorrelationID: payload.correlationId,
          }),
        }).catch((err) => {
          console.log(err, {
            serviceName: payload.serviceName,
            environment: payload.environment,
            timestamp: new Date().toISOString(),
            severity: LOG_SEVERITY.ERROR,
            functionName: 'logMessage',
            exception: err.stack,
            message: err.message,
            correlationId: payload.correlationId,
          })
        });
    }

    /**
     * 
     * @param {CountersPayload} countersPayload 
     */
    async logCounter(payload){
        const loggerUrl = this.#loggingOptions.MONITORING_URL + this.#loggingOptions.COUNTERS_ENDPOINT
        return await fetch(loggerUrl, {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify({
              ServiceName: payload.serviceName,
              Environment: payload.environment,
              Label: payload.label,
              Metadata: payload.metadata,
            }),
          }).catch((err) => {
          console.log(err)
          this.logMessage({
            serviceName: payload.serviceName,
            environment: payload.environment,
            timestamp: new Date().toISOString(),
            severity: LOG_SEVERITY.ERROR,
            functionName: 'logCounter',
            exception: err.stack,
            message: err.message,
            correlationId: undefined,
          })
        })
    }

    /**
     * 
     * @param {TimersPayload} timersPayload 
     */
    async logTimer(payload){
        const loggerUrl = this.#loggingOptions.MONITORING_URL + this.#loggingOptions.TIMERS_ENDPOINT
        return await fetch(loggerUrl, {
          method: 'POST',
          headers: this.#headers,
          body: JSON.stringify({
            ServiceName: payload.serviceName,
            Environment: payload.environment,
            Label: payload.label,
            Duration: payload.duration,
          }),
        }).catch((err) => {
          console.log(err)
          this.logMessage({
            serviceName: payload.serviceName,
            environment: payload.environment,
            timestamp: new Date().toISOString(),
            severity: LOG_SEVERITY.ERROR,
            functionName: 'logTimer',
            exception: err.stack,
            message: err.message,
            correlationId: undefined,
          })
        })
    }
}

module.exports = {
    AzureLoggingService,
    KNOWN_SERVICES,
    KNOWN_LABELS,
    LOG_SEVERITY
};

/**
 * @typedef {import('../utils/logWrapper.js').AzureLoggingOptions} AzureLoggingOptions
 */
/**
 * @typedef {Object} MessagePayload
 * @property {string} serviceName
 * @property {string} environment
 * @property {string} timestamp
 * @property {string} severity
 * @property {string} functionName
 * @property {string} exception
 * @property {string} message
 * @property {string} [correlationId]
 */

/**
 * @typedef {Object} CountersPayload
 * @property {string} serviceName
 * @property {string} environment
 * @property {string} label
 * @property {{string : string}} [metadata]
 */

/**
 * @typedef {Object} TimersPayload
 * @property {string} serviceName
 * @property {string} environment
 * @property {string} label
 * @property {number} duration
 */