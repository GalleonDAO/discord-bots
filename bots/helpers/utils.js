const fetch = require('node-fetch')

module.exports.fetchData = async (tokenId) => {
  try {
    const tokenData = await (
      await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`)
    ).json()

    const price = tokenData.market_data.current_price.usd
    const symbol = tokenData.symbol.toUpperCase()
    const circSupply = tokenData.market_data.circulating_supply
    const change = tokenData.market_data.price_change_percentage_24h

    return { price, symbol, circSupply, change }
  } catch (err) {
    console.log(err)
    return undefined
  }
}

module.exports.numberWithCommas = (num) => num.toLocaleString()
