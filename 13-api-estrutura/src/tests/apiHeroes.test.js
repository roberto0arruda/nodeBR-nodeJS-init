const assert = require('assert')
const api = require('../api')
let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU5ODk5MDA0NH0.BbPRrJ_BppizDAwHfUv_UisLkr-2LbQ4Jfhp8NdRpBw'

const headers = {
    Authorization: TOKEN
}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}

let MOCK_ID = ''

describe('Suite de Testes da API Heroes com MongoDB', function () {
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            headers,
            url: '/heroes',
            payload: MOCK_HEROI_INICIAL
        })

        const { _id } = JSON.parse(result.payload)
        MOCK_ID = _id
    })

    it('Listar /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/heroes'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar /heroes - Deve retornar 3 registros', async () => {
        const TAMANHO_LIMIT = 3
        const result = await app.inject({
            method: 'GET',
            headers,
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
            headers,
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
        const TAMANHO_LIMIT = 10
        const NAME = 'Gavião Negro'
        const result = await app.inject({
            method: 'GET',
            headers,
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
            headers,
            url: '/heroes',
            payload: MOCK_HEROI_CADASTRAR
        })

        const { message, _id } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi Cadastrado com sucesso!')
    })

    it('Atualizar PATCH - /heroes/:id - deve atualizar um heroi', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/heroes/${_id}`,
            payload: expected
        })

        const { message } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(message, 'Heroi atualizado com sucesso!')
    })

    it('Atualizar PATCH - /heroes/:id - não deve atualizar com ID incorreto', async () => {
        const _id = `5ef75aa26e45a359635e1101`

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/heroes/${_id}`,
            payload: {
                poder: 'Super Mira'
            }
        })

        const expected = { statusCode: 412, error: "Precondition Failed", message: "Não foi possivel atualizar!" }

        assert.ok(result.statusCode === 412)
        assert.deepEqual(JSON.parse(result.payload), expected)
    })

    it('Remover DELETE - /heroes/:id - deve remover o heroi pelo ID', async () => {
        const _id = MOCK_ID

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        })

        const { message } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(message, 'Heroi removido com sucesso!')
    })

    it('Remover DELETE - /heroes/:id - não deve remover o heroi, id não encontrado', async () => {
        const _id = `5ef75aa26e45a359635e1101`

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        })

        const expected = { statusCode: 412, error: "Precondition Failed", message: "Não foi possivel remover item!" }

        assert.ok(result.statusCode === 412)
        assert.deepEqual(JSON.parse(result.payload), expected)
    })

    it('Remover DELETE - /heroes/:id - não deve remover com ID invalido', async () => {
        const _id = `ID_INVALIDO`

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        })

        const expected = { statusCode: 500, error: "Internal Server Error", message: "An internal server error occurred" }

        assert.ok(result.statusCode === 500)
        assert.deepEqual(JSON.parse(result.payload), expected)
    })
})