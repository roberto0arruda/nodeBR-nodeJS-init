const { obterPessoa } = require('./service')

Array.prototype.meuFilter = function (callback) {
    const lista = []
    for (index in this) {
        const item = this[index]
        const result = callback(item, index, this)

        if (!result) continue;
        lista.push(item)
    }

    return lista
}

async function main() {
    try {
        const { results } = await obterPessoa('a')

        // const familiaLars = results.filter(function (item) {
        //     // retorna false para remover da lista e true para manter
        //     const result = item.name.toLowerCase().indexOf(`lars`) !== -1
        //     // indexOf() = -1 não encontrou, se encontrou retorna posiçãoNoArray

        //     return result
        // })

        const familiaLars = results.meuFilter((item, index, lista) => {
            console.log(`index: ${index}`, lista.length)
            return item.name.toLowerCase().indexOf('lars') !== -1
        })
        const nomes = familiaLars.map((pessoa) => pessoa.name)

        console.log(nomes)
    } catch (error) {
        console.error('DEU RUIM', error)
    }
}
main()