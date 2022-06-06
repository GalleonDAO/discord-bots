const { 
    numberWithCommas,
    getPercentageChange
}            = require('../src/helpers/utils');
const {
    describe,
    it
}            = require('mocha');
const expect = require('chai').expect;

describe("Formatting tools", function(){
    describe("Formatting tools", function(){
        it("4 digit Int - returns with commas", function(){
            const expected = "1,000";

            const result = numberWithCommas(1000);
            expect(result).to.equal(expected);
        });
    });
    describe("Get Percentage Change", function(){
        it("two valid numbers - Returns percentage change", function(){
            const expected = 10;

            const result = getPercentageChange(100, 110);
            expect(result).to.equal(expected);
        });
    });
});