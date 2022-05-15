# ETHMAXY Price Bot

A Discord bot that fetches and shows ETHMAXY token data from Coingecko.

## Docker
A docker image for the bot is available on [Docker Hub](https://hub.docker.com/r/galleoncore/ethmaxy-price)
### Running the container
To run the container for your server First add the bot to your server and note the generated API Key ([See Configuration](#configuration-🔧))
``` 
docker run -d -e DISCORD_API_TOKEN="{YOUR TOKEN HERE}" galleoncore/ethmaxy-price:latest
```

## Developer quick start 👩‍💻

`npm run dev` will launch the bot locally, with hot reloading included.

### Configuration 🔧

First, install the dependencies:
`npm install`
`npm install -D`

For the bot to run, it needs these variables, laid out in the `.env.sample` file:

- `DISCORD_API_TOKEN`: Your discord API token. [See this guide on how to obtain one](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).