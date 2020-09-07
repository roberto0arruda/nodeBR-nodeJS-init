const assert = require('assert')
const api = require('../api')

const contextStrategy = require('../db/strategies/base/contextStrategy')
const PostgresSQLStrategy = require('../db/strategies/postgres/postgresSQLStrategy')
const UsuarioSchema = require('../db/strategies/postgres/schemas/UsuarioSchema')

let app = {}

const USER = {
    username: 'xuxadasilva',
    password: '123'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$SuK.vrunNClyDDVxilh.QeK5X/xRC/BGJ13IiS4ccxhuOJms/4R7S'
}

describe('Auth Test Suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connection = await PostgresSQLStrategy.connect()
        const model = await PostgresSQLStrategy.defineModel(connection, UsuarioSchema)
        const contextPostgres = new contextStrategy(new PostgresSQLStrategy(connection, model))
        const result = await contextPostgres.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'post',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 32)
    })

    it('deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'post',
            url: '/login',
            payload: {
                username: 'roberto',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })
})
