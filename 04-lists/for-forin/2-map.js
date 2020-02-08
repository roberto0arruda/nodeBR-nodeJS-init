const service = require('./service')

Array.prototype.meuMap = function (callback) {
    const novoArrayMapeado = []
    for (let index = 0; index < this.length; index++) {
        const resultado = callback(this[index], index)
        novoArrayMapeado.push(resultado)
    }

    return novoArrayMapeado
}

async function main() {
    try {
        const result = await service.obterPessoa('a')

        // const nomes = []
        // result.results.forEach(function (item) {
        //     nomes.push(item.name)
        // })

        // const nomes = result.results.map(function (pessoa) {
        //     return pessoa.name
        // })

        // const nomes = result.results.map((pessoa) => pessoa.name)

        const nomes = result.results.meuMap(function (pessoa, index) {
            return `[${index}]${pessoa.name}`
        })

        console.log('nomes', nomes)
    } catch (error) {
        console.error('DEU RUIM', error)
    }
}

main()