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

    it('Atualizar', async function () {
        const [baseHeroi] = await contextPostgres.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        const heroiAtualizado = {
            ...baseHeroi,
            nome: 'Goku',
            poder: 'Deus'
        }
        delete heroiAtualizado.id
        const [result] = await contextPostgres.update(baseHeroi.id, heroiAtualizado)
        assert.deepEqual(result, 1)
    })

    it('Deletar pelo id', async function () {
        const [item] = await contextPostgres.read({})
        const result = await contextPostgres.delete(item.id)
        assert.deepEqual(result, 1)
    })
})