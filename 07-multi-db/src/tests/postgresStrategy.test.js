const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const contextStrategy = require('../db/strategies/base/contextStrategy')

const contextPostgres = new contextStrategy(new Postgres())

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    it('Postgres Connection', async function () {
        const result = await contextPostgres.isConnected()
        assert.equal(result, true)
    })
})