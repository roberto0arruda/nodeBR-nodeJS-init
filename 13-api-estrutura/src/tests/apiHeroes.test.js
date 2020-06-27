const assert = require('assert')
const api = require('../api')
let app = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

describe.only('Suite de Testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Listar /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /heroes - Deve retornar 5 registros', async () => {
        const TAMANHO_LIMIT = 5
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMIT}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMIT)
    })

    it('Listar /heroes - deve retornar um erro limit incorretos', async () => {
        const TAMANHO_LIMIT = 'ASDAS'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMIT}`
        })

        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": { "source": "query", "keys": ["limit"] }
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('Listar GET - /heroes - deve filtrar um item', async () => {
        const TAMANHO_LIMIT = 100
        const NAME = 'flash'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMIT}&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome === NAME)
    })

    it('Cadastrar POST - /heroes - deve cadastrar um item', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: MOCK_HEROI_CADASTRAR
        })

        const { message, _id } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi Cadastrado com sucesso!')
    })
})