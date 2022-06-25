const { numberWithCommas } = require('./utils')

module.exports.getNickname = (price, change) => {
  return `$${price ? numberWithCommas(price) : '-'} | ${
    change ? change.toFixed(2) : '-'
  }%`
}

module.exports.getActivity = (marketCap) => {
  return `MC: ${marketCap ? numberWithCommas(marketCap) : '-'}`
}

module.exports.setDiscordText = (client, nickname, activity) => {
  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(nickname)
  })
  if (client.user) {
    client.user.setActivity(activity, {
      type: 'WATCHING',
    })
  }
}
