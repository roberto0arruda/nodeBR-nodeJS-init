const assert = require('assert')
const mongoDBStrategy = require('../db/strategies/mongoDBStrategy')
const contextStrategy = require('../db/strategies/base/contextStrategy')

const contextMongo = new contextStrategy(new mongoDBStrategy())
const MOCK_HEROI_CADASTRAR = {
    nome: 'flash',
    poder: 'velocidade'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Flash ${Date.now()}`,
    poder: 'velocidade'
}

let MOCK_HEROI_ID = ''

describe('Mongo Suite de Testes', function () {
    this.beforeAll(async () => {
        await contextMongo.connect()

        const result = await contextMongo.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })

    it('verificar conexao', async () => {
        const resul = await contextMongo.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(resul, expected)
    })

    it('Cadastrar', async () => {
        const { nome, poder } = await contextMongo.create(MOCK_HEROI_CADASTRAR)

        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('Listar', async () => {
        const [{ nome, poder }] = await contextMongo.read({ nome: MOCK_HEROI_CADASTRAR.nome })

        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('Atualizar', async () => {
        const result = await contextMongo.update(MOCK_HEROI_ID, {
            nome: 'Lanterna Verde'
        })

        assert.deepEqual(result.nModified, 1)
    })

    it('Remover', async () => {
        const result = await contextMongo.delete(MOCK_HEROI_ID)

        assert.deepEqual(result.n, 1)
    })
})