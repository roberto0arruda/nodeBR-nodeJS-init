const { deepEqual } = require('assert')
const database = require('./database')

const DEFAULT_ITEM = {
    nome: 'Flash',
    poder: 'Speed',
    id: 1
}

const DEFAULT_ITEM_2 = {
    nome: 'Lanterna Verde',
    poder: 'Green',
    id: 2
}

describe('Suite de teste, manipulação de heroi', () => {
    before(async () => {
        await database.cadastrar(DEFAULT_ITEM)
        await database.cadastrar(DEFAULT_ITEM_2)
    })

    after(async () => {
        await database.remover()
    })

    it('deve pesquisar um heroi pelo id usando arquivos', async () => {
        const expected = DEFAULT_ITEM
        const [resultado] = await database.listar(expected.id)

        deepEqual(resultado, expected)
    })

    it('deve cadastrar um novo heroi usando arquivos', async () => {
        const expected = DEFAULT_ITEM
        const cadastrou = await database.cadastrar(expected)
        const [atual] = await database.listar(expected.id)

        deepEqual(atual, expected)
    })

    it('deve remover o heroi pelo id', async () => {
        const expected = true
        const resultado = await database.remover(DEFAULT_ITEM.id)

        deepEqual(resultado, expected)
    })

    it('deve atualizar um heroi pelo id', async () => {
        const expected = {
            ...DEFAULT_ITEM_2,
            nome: 'Batman',
            poder: 'Cash'
        }

        const novoDado = {
            nome: 'Batman',
            poder: 'Cash'
        }

        await database.atualizar(DEFAULT_ITEM_2.id, novoDado)
        const [resultado] = await database.listar(DEFAULT_ITEM_2.id)

        deepEqual(resultado, expected)
    })

})