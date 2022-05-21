const { 
    numberWithCommas,
    fetchCoingeckoData,
    fetchTokensetsData 
}          = require('../src/helpers/utils');
const {
    describe,
    it
}            = require('mocha');
const expect = require('chai').expect;
const nock   = require('nock');

const COINGECKO_URL     = 'https://api.coingecko.com/api/v3/coins'
const TOKENSETS_URL     = 'https://api.tokensets.com/v2/funds'
const COINGECKO_TOKENID = 'eth-max-yield-index'
const TOKENSETS_TOKENID = 'ethmaxy'

describe("Price Fetching Services", function() {
    describe("Coingecko data fetch", function() {
        it("Happy Path - fetches data and maps", async function() {
            const expected = { 
                price: 100000000,
                symbol: "ETHMAXY",
                circSupply: 1000.0,
                change: 69.123456789
            }

            nock(COINGECKO_URL)
                .get(`/${COINGECKO_TOKENID}`)
                .reply(200, {
                    market_data: {
                        current_price: {
                            "gbp": 8000000,
                            "usd": 100000000
                        },
                        circulating_supply: 1000.0,
                        price_change_percentage_24h: 69.123456789
                    },
                    symbol: "ethmaxy"
                })
            
            const coingeckoData = await fetchCoingeckoData(COINGECKO_TOKENID)
            expect(coingeckoData).to.deep.equal(expected)
        });
    });

    describe("TokenSets data fetch", function() {
        it("Happy Path - fetches data and maps", async function() {
            const expected = { 
                price: "1000.0",
                symbol: "ETHMAXY",
                marketCap: "$100,000,000.00",
            }

            nock(TOKENSETS_URL)
                .get(`/${TOKENSETS_TOKENID}`)
                .reply(200, {
                    fund: {
                        symbol: "ethmaxy",
                        price_usd: "1000.0",
                        market_cap: "$100,000,000.00"
                    }
                })

            const tokensetsData = await fetchTokensetsData(TOKENSETS_TOKENID)
            expect(tokensetsData).to.deep.equal(expected)
        });
    });
});