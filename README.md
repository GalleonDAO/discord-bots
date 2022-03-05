# Galleon Doubloon Bot

A Discord bot that fetches and shows Galleon token data from Coingecko.

## Developer quick start 👩‍💻

`npm run dev` will launch the bot locally, with hot reloading included.

### Configuration 🔧

First, install the dependencies:
`npm install`
`npm install -D`

For the bot to run, it needs these variables, laid out in the `.env.sample` file:

- `DISCORD_API_TOKEN`: Your discord API token. [See this guide on how to obtain one](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).
- `TOKEN_ID`: Your token ID on CoinGecko. (The identifier on the CoinGecko URL of your token).