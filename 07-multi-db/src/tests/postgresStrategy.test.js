const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const contextStrategy = require('../db/strategies/base/contextStrategy')

const contextPostgres = new contextStrategy(new Postgres())
const MOCK_HEROI_CADASTRAR = {
    nome: 'Gavião',
    poder: 'Flexas'
}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)
    it('Postgres Connection', async function () {
        const result = await contextPostgres.isConnected()
        assert.equal(result, true)
    })

    it('Cadastrar', async function () {
        const result = await contextPostgres.create(MOCK_HEROI_CADASTRAR)
        delete result.id

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async function () {
        const [result] = await contextPostgres.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        delete result.id

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
})