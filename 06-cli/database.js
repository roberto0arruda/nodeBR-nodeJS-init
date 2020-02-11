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
}

module.exports = new Database()