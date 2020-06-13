const assert = require('assert')
const api = require('../api')
let app = {}
describe('Suite de Testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Listar /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10'
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

        assert.deepEqual(result.payload, 'Erro interno no servidor')
    })

    it('Listar /heroes - deve filtrar um item', async () => {
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
})