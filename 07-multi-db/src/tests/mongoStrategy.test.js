const assert = require('assert')
const mongoDBStrategy = require('../db/strategies/mongoDBStrategy')
const contextStrategy = require('../db/strategies/base/contextStrategy')

const contextMongo = new contextStrategy(new mongoDBStrategy())
describe('Mongo Suite de Testes', function () {
    this.beforeAll(async () => {
        await contextMongo.connect()
    })

    it('verificar conexao', async () => {
        const resul = await contextMongo.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(resul, expected)
    })
})