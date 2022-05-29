const {
    describe,
    it
}            = require('mocha');
const expect = require('chai').expect;
const nock   = require('nock');
const {
    fetchCoingeckoData,
    fetchTokensetsData,
    fetchTokensetsChange,
    tokensetsIsValid,
    coingeckoIsValid
} = require('../src/services/tokenDataService');

const COINGECKO_URL         = 'https://api.coingecko.com/api/v3/coins'
const TOKENSETS_URL         = 'https://api.tokensets.com/v2/funds'
const TOKENSETS_HISTORY_URL = 'https://api.tokensets.com/v2/fund_historicals'
const INTERVAL              = 'day'
const COINGECKO_TOKENID     = 'eth-max-yield-index'
const TOKENSETS_TOKENID     = 'ethmaxy'

describe("Price Fetching Services", function() {
    describe("fetchCoingeckoData", function() {
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

    describe("fetchTokensetsData", function() {
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
    describe("fetchTokensetsChange", function() {
        it("Happy Path - fetches data and maps", async function() {
            const expected = 10

            nock(TOKENSETS_HISTORY_URL)
                .get(`/${TOKENSETS_TOKENID}`)
                .query({
                    interval: INTERVAL,
                    currency: "usd"
                })
                .reply(200, {
                    prices:[
                        "100",
                        "105",
                        "110"
                    ]
                })

            const tokensetsChange = await fetchTokensetsChange(TOKENSETS_TOKENID)
            expect(tokensetsChange).to.deep.equal(expected)
        });
    });
});

describe("Validation", function(){
    describe("tokensetsIsValid", function(){
        it("All required fields - returns true", function(){
            const data = {
                price: "1000.0",
                symbol: "ETHMAXY",
                marketCap: "$100,000,000.00"
            };
            const result = tokensetsIsValid(data);

            expect(result).true;
        });
        it("no price - returns false", function(){
            const data = {
                symbol: "ETHMAXY",
                marketCap: "$100,000,000.00"
            };
            const result = tokensetsIsValid(data);

            expect(result).false;
        });
        it("no symbol - returns false", function(){
            const data = {
                price: "1000.0",
                marketCap: "$100,000,000.00"
            };
            const result = tokensetsIsValid(data);

            expect(result).false;
        });
        it("no marketcap - returns false", function(){
            const data = {
                price: "1000.0",
                symbol: "ETHMAXY",
            };
            const result = tokensetsIsValid(data);

            expect(result).false;
        });
    });
    describe("coingeckoIsValid", function(){
        it("All required fields - returns true", function(){

        
            const data = {
                price: 100000000,
                symbol: "ETHMAXY",
                circSupply: 1000.0,
                change: 69.123456789
            };
            const result = coingeckoIsValid(data);
    
            expect(result).true;
        });
        it("No price - returns false", function(){

        
            const data = {
                symbol: "ETHMAXY",
                circSupply: 1000.0,
                change: 69.123456789
            };
            const result = coingeckoIsValid(data);
    
            expect(result).false;
        });
        it("No symbol - returns false", function(){

        
            const data = {
                price: 100000000,
                circSupply: 1000.0,
                change: 69.123456789
            };
            const result = coingeckoIsValid(data);
    
            expect(result).false;
        });
        it("No supply - returns false", function(){

        
            const data = {
                price: 100000000,
                symbol: "ETHMAXY",
                change: 69.123456789
            };
            const result = coingeckoIsValid(data);
    
            expect(result).false;
        });
        it("No change - returns false", function(){

        
            const data = {
                price: 100000000,
                symbol: "ETHMAXY",
                circSupply: 1000.0,
            };
            const result = coingeckoIsValid(data);
    
            expect(result).false;
        });
    })
})