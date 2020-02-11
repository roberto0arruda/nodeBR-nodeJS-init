const { deepEqual } = require('assert')
const database = require('./database')

const DEFAULT_ITEM = {
    nome: 'Flash',
    poder: 'Speed',
    id: 1
}

describe('Suite de teste, manipulação de heroi', () => {
    before(async () => {
        await database.cadastrar(DEFAULT_ITEM)
    })

    it('deve pesquisar um heroi pelo id usando arquivos', async () => {
        const expected = DEFAULT_ITEM
        const [resultado] = await database.listar(expected.id)

        deepEqual(resultado, expected)
    })

    it('deve cadastrar um novo heroi usando arquivos', async () => {
        const expected = { id: 2, nome: 'Batman', poder: 'Cash' }
        const cadastrou = await database.cadastrar(expected)
        const [atual] = await database.listar(expected.id)

        deepEqual(atual, expected)
    })

})