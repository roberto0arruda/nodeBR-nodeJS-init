const { deepEqual } = require('assert')
const database = require('./database')

const DEFAULT_ITEM = {
    nome: 'Flash',
    poder: 'Speed',
    id: 1
}

describe('Suite de teste, manipulação de heroi', () => {

    it('deve pesquisar um heroi pelo id usando arquivos', async () => {
        const expected = DEFAULT_ITEM
        const [resultado] = await database.listar(expected.id)

        deepEqual(resultado, expected)
    })

})