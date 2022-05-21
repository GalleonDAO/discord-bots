const fetch = require('node-fetch')

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins'
const TOKENSETS_URL = 'https://api.tokensets.com/v2/funds'

module.exports.fetchCoingeckoData = async (tokenId) => {
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
    console.log(err)
    return undefined
  }
}

module.exports.fetchTokensetsData = async (tokenId) => {
  try {
    const tokenData = await (
      await fetch(`${TOKENSETS_URL}/${tokenId}`)
    ).json()

    const price = tokenData.fund.price_usd
    const symbol = tokenData.fund.symbol.toUpperCase()
    const marketCap = tokenData.fund.market_cap

    return { price, symbol, marketCap }
  } catch (err) {
    console.log(err)
    return undefined
  }
}

module.exports.numberWithCommas = (num) => num.toLocaleString()
