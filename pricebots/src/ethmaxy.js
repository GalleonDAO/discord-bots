const { 
  numberWithCommas,
  fetchCoingeckoData,
  fetchTokensetsData 
}                      = require('./helpers/utils')
const { Client }       = require('discord.js')
const dotenv           = require('dotenv')

const COINGECKO_TOKENID = 'eth-max-yield-index'
const TOKENSETS_TOKENID = 'ethmaxy'

dotenv.config()
//Allow token to be supplied as DISCORD_API_TOKEN_ETHMAXY or DISCORD_API_TOKEN for ease of use
const DISCORD_API_TOKEN = !process.env.DISCORD_API_TOKEN_ETHMAXY ? process.env.DISCORD_API_TOKEN : process.env.DISCORD_API_TOKEN_ETHMAXY

let client = new Client()
client.login(DISCORD_API_TOKEN)
client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag} 🤖`)
  //Get price on launch
  updateBot()

  //Update loop
  setInterval(async () => {
    await updateBot()
  }, 1 * 1000 * 60)
})

const updateBot = async () => {
  console.log('Fething data...')
  const coingeckoData = await fetchCoingeckoData(COINGECKO_TOKENID)
  const tokensetsData = await fetchTokensetsData(TOKENSETS_TOKENID)

  if (!coingeckoData || !tokensetsData) {
    console.warn('Missing data\r\ncoingecko: ' + JSON.stringify(coingeckoData) + '\r\ntokensets: ' + JSON.stringify(tokensetsData))
    return
  }

  const { change } = coingeckoData
  const { 
    price,
    symbol,
    marketCap
  } = tokensetsData

  console.log('Fetched: ' + symbol, price, marketCap)

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(
      `${
        price
          ? '$' + numberWithCommas(price) + ' | ' + change.toFixed(2) + '%'
          : ''
      }`,
    )
  })
  if (client.user) {
    client.user.setActivity(
      'MC: ' + numberWithCommas(marketCap),
      { type: 'WATCHING' },
    )
  }
}