const assert = require('assert')
const MongoDBStrategy = require('../db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroiSchema')
const contextStrategy = require('../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'flash',
    poder: 'velocidade'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Flash ${Date.now()}`,
    poder: 'velocidade'
}

let MOCK_HEROI_ID = ''

let contextMongo = {}

describe('MongoDBStrategy Test Suite', function () {
    this.beforeAll(async () => {
        const connection = MongoDBStrategy.connect()
        contextMongo = new contextStrategy(new MongoDBStrategy(connection, HeroiSchema))

        const result = await contextMongo.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id

        console.log('contextMongo', contextMongo)
    })

    it('verificar conexao', async () => {
        const result = await contextMongo.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
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