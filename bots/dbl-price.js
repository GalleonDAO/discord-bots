const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { fetchData, numberWithCommas } = require('./helpers/utils')

dotenv.config()

let client = new Client()
client.login(process.env.DISCORD_API_TOKEN)
client.on('ready', () =>
  console.log(`Bot successfully started as ${client.user.tag} 🤖`),
)

const task = async () => {
  const data = await fetchData()

  if (!data) return

  const { price, symbol, circSupply, change } = data

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

setInterval(async () => {
  await task()
}, 1 * 1000 * 60)
