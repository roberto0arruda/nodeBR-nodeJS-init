const assert = require('assert')
const api = require('../api')
let app = {}

describe('Auth Test Suite', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'post',
            url: '/login',
            payload: {
                username: 'xuxadasilva',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200);
        assert.ok(dados.token.length > 32)
    })
})
