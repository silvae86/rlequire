const util = require("../../../../src/util");
const rlequire = require("../../../../index");

const chai = require("chai");
const should = chai.should();

const isNull = require(util.pathInApp("src/util.js")).isNull;

describe("[Utils]", function (done)
{
    describe("isNull", function ()
    {
        it("Should return true on null object", function (done)
        {
            if (isNull(null))
            {
                done();
            }
            else
            {
                done("isNull returned false when had null as argument");
            }
        });
        it("Should return false on not null object", function (done)
        {
            if (!isNull("D"))
            {
                done();
            }
            else
            {
                done("isNull returned true when had string as argument");
            }
        });
        it("Should return true on undefined object", function (done)
        {
            if (isNull(undefined))
            {
                done();
            }
            else
            {
                done("isNull returned false when had undefined as argument");
            }
        });
    });
});

describe("[Logic]", function (done)
{
    describe("RLequire mock-app", function ()
    {
        it("Should find the mock-app and run a function in a file contained in it", function (done)
        {
            rlequire("mock-app", "mock-app").MockApp.testFunction().should.equal("mockAppFunctionResult");
            done();
        });

        it("Should find the mock-app and get a field contained in it", function (done)
        {
            rlequire("mock-app", "mock-app").MockApp.testField.should.equal("mockAppTestField");
            done();
        });

        it("Should find the mock-app and get a field contained in it after caching", function (done)
        {
            rlequire("mock-app", "mock-app").MockApp.testField.should.equal("mockAppTestField");
            done();
        });

        it("Should find the mock-app and get a field contained in it forcing rescan of directories", function (done)
        {
            rlequire("mock-app", "mock-app", true).MockApp.testField.should.equal("mockAppTestField");
            done();
        });
    });

    describe("RLequire mock-subapp", function ()
    {
        it("Should find the mock-subapp and run a function in a file contained in it", function (done)
        {
            rlequire("mock-subapp", "mock-subapp").MockSubApp.testFunction().should.equal("mockSubAppFunctionResult");
            done();
        });

        it("Should find the mock-subapp and get a field contained in it", function (done)
        {
            rlequire("mock-subapp", "mock-subapp").MockSubApp.testField.should.equal("mockSubAppTestField");
            done();
        });

        it("Should find the mock-app and get a field contained in it after caching", function (done)
        {
            rlequire("mock-app", "mock-app").MockApp.testField.should.equal("mockAppTestField");
            done();
        });

        it("Should find the mock-app and get a field contained in it forcing rescan of directories", function (done)
        {
            rlequire("mock-app", "mock-app", true).MockApp.testField.should.equal("mockAppTestField");
            done();
        });
    });

    describe("RLequire non-existent app", function ()
    {
        it("Should not find the aiaimaria app", function (done)
        {
            (function()
            {
                rlequire("aiaimaria", "mock-subapp").MockSubApp.testFunction()
            })
            .should.throw(Error);
            done();
        });
    });

    describe("RLequire malformed package.json", function ()
    {
        it("Should throw error for malformed package.json file", function (done)
        {
            (function()
            {
                rlequire("malformed-package-json", "mock-subapp").MockSubApp.testFunction()
            }).should.throw(Error);
            done();
        });
    });
});
