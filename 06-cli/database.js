const { readFile, writeFile } = require("fs")
const { promisify } = require("util")

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

// outra forma de obter dados do Json
// const dadosJson = require('./herois.json')

class Database {
    constructor() {
        this.NOME_ARQUIVO = "herois.json"
    }

    async obterDadosArquivo() {
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, "utf8")
        return JSON.parse(arquivo.toString())
    }

    async escreverArquivo(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados, null))
        return true;
    }

    async listar(id) {
        const dados = await this.obterDadosArquivo()
        const dadosFiltrado = dados.filter(item => (id ? item.id === id : true))
        return dadosFiltrado
    }

    async cadastrar(heroi) {
        const dados = await this.obterDadosArquivo()
        const id = heroi.id <= 2 ? heroi.id : Date.now()

        const heroiComId = { id, ...heroi }
        const dadosFinal = [...dados, heroiComId]

        const cadastrou = await this.escreverArquivo(dadosFinal)
        return cadastrou;
    }

    async remover(id) {
        if (!id) {
            return await this.escreverArquivo([])
        }

        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if (indice === -1) {
            throw Error('O usuário não foi encontrado!')
        }

        dados.splice(indice, 1)

        return this.escreverArquivo(dados)
    }

    async atualizar(id, modificacoes) {
        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if (indice === -1) {
            throw Error('O heroi informado não existe!')
        }

        const atual = dados[indice]
        const objetoAtualizado = {
            ...atual,
            ...modificacoes
        }
        dados.splice(indice, 1)

        return await this.escreverArquivo([
            ...dados,
            objetoAtualizado
        ])
    }
}

module.exports = new Database()