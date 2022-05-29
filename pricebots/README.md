# Galleon Price Bot

A Discord bot that fetches and shows token data for Galleon tokens

### Available tokens

| Name        | Token Variable | Description                                                                            |
| ----------- | -------------- | -------------------------------------------------------------------------------------- |
| Doubloon    | dbl            | [Governance token for Galleon](https://docs.galleon.community/doubloon-token/purpose)  |
| ETHMAXY     | ethmaxy        | [ETH Max Yield Index](https://docs.galleon.community/products/ethmaxy)                 |

## Docker
A docker image for the bot is available on [Docker Hub](https://hub.docker.com/r/galleoncore/pricebot)

### Running the container
To run the container for your server First add the bot to your server and note the generated API Key ([See Configuration](#configuration-🔧)) </br>
You will also need to choose which token the bot should track ([See Token Variable](#available-tokens))

``` 
docker run -d -e TOKEN={Token Variable} -e DISCORD_API_TOKEN="{YOUR TOKEN HERE}" galleoncore/pricebot:latest
```

## Docker Compose
A docker compose file has been included to simplify deploying multiple instances of the bot if you wish to track more than one token. </br>
Add your Discord API tokens to the DISCORD_API_TOKEN Environment variable and run `docker-compose up --build` optionally adding `-d` to run the containers in detatched mode

## Developer quick start 👩‍💻
See [Available Tokens](#available-tokens) for Token Variables </br>
`npm run dev:{Token Variable}` will launch the bot locally, with hot reloading included.

### Configuration 🔧

First, install the dependencies:
`npm install`
`npm install -D`

For the bot to run, it needs these variables, laid out in the `.env.sample` file:

- `DISCORD_API_TOKEN`: Your discord API token. [See this guide on how to obtain one](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).