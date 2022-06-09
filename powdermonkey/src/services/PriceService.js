const fetch               = require('node-fetch');
const { LOG_SEVERITY } = require('./azureLoggingService');

const COINGECKO_URL         = 'https://api.coingecko.com/api/v3/coins'

class PriceService{
    #logger;

    /**
     * @param {import('../utils/logWrapper').LogWrapper} logger 
     */
    constructor(logger){
        this.#logger = logger;
        this.KNOWN_TOKENS = {
            dbl : "doubloon",
            ethmaxy : "eth-max-yield-index"
        }
    }

    async fetchCoingeckoData(tokenId){
        try {
            const tokenData = await (
            await fetch(`${COINGECKO_URL}/${tokenId}`)
            ).json()

            //unused but kept for future
            const price = tokenData.market_data.current_price.usd
            const symbol = tokenData.symbol.toUpperCase()
            const circSupply = tokenData.market_data.circulating_supply

            //Needed because tokensets does not return 24h change
            const change = tokenData.market_data.price_change_percentage_24h
            return { price, symbol, circSupply, change }
        } catch (err) {
            this.#logger.logMessage(LOG_SEVERITY.ERROR, this.fetchCoingeckoData.name, err.stack, "Error Fetching coingecko price data");
            return undefined
        }
    }
}

module.exports = {
    PriceService
}