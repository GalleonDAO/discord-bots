const {
  fetchCoingeckoData,
  fetchTokensetsData,
  tokensetsIsValid,
  fetchTokensetsChange,
} = require('./services/tokenDataService')
const {
  getNickname,
  getActivity,
  setDiscordText,
} = require('./helpers/discordhelpers')
const { Client } = require('discord.js')
const dotenv = require('dotenv')

const COINGECKO_TOKENID = 'eth-max-yield-index'
const TOKENSETS_TOKENID = 'ethmaxy'

dotenv.config()
//Allow token to be supplied as DISCORD_API_TOKEN_ETHMAXY or DISCORD_API_TOKEN for ease of use
const DISCORD_API_TOKEN = !process.env.DISCORD_API_TOKEN_ETHMAXY
  ? process.env.DISCORD_API_TOKEN
  : process.env.DISCORD_API_TOKEN_ETHMAXY

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
    console.warn(
      'Missing data\r\ncoingecko: ' +
        JSON.stringify(coingeckoData) +
        '\r\ntokensets: ' +
        JSON.stringify(tokensetsData),
    )
    return
  }

  if (tokensetsIsValid(tokensetsData)) {
    let { change } = coingeckoData
    const { price, symbol, marketCap } = tokensetsData

    console.log('Fetched: ' + symbol, price, marketCap)

    if (!change) {
      console.log('No Price change available for Coingecko, using fallback')
      change = await fetchTokensetsChange(TOKENSETS_TOKENID)
      if (!change)
        console.log('No Price change available for Tokensets, failing over')
    }

    const nickname = getNickname(price, change)
    const activity = getActivity(marketCap)

    setDiscordText(client, nickname, activity)
  }
}
