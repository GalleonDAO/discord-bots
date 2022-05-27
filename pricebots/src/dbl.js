const { 
  numberWithCommas,
  fetchCoingeckoData 
}                      = require('./helpers/utils')
const { Client }       = require('discord.js')
const dotenv           = require('dotenv')

const COINGECKO_TOKENID = 'doubloon'

dotenv.config()
//Allow token to be supplied as DISCORD_API_TOKEN_DBL or DISCORD_API_TOKEN for ease of use
const DISCORD_API_TOKEN = !process.env.DISCORD_API_TOKEN_DBL ? process.env.DISCORD_API_TOKEN : process.env.DISCORD_API_TOKEN_DBL

let client = new Client()
client.login(DISCORD_API_TOKEN)
client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag} 🤖`)

  //Getprice on launch
  updateBot()

    //Update loop
  setInterval(async () => {
    await updateBot()
  }, 1 * 1000 * 60)
})

const updateBot = async () => {
  console.log('Fething data...')
  const coingeckoData = await fetchCoingeckoData(COINGECKO_TOKENID)            

  if (!coingeckoData){
    console.warn('Missing data\r\ncoingecko: ' + JSON.stringify(coingeckoData))
    return
  }

  const { 
    price,
    symbol,
    circSupply,
    change
  } = coingeckoData

  console.log('Fetched: ' + symbol, price, circSupply)

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
      'MC: $' + numberWithCommas(Math.round(price * circSupply)),
      { type: 'WATCHING' },
    )
  }
}