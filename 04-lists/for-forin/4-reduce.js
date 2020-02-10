const { obterPessoa } = require('./service')

Array.prototype.meuReduce = function (callback, valorInicial) {
    let valorFinal = typeof valorInicial !== 'undefined' ? valorInicial : this[0]
    let index = typeof valorInicial !== 'undefined' ? 0 : 1

    for (index; index <= this.length - 1; index++) {
        valorFinal = callback(valorFinal, this[index], this)
    }

    return valorFinal
}

async function main() {
    try {
        const { results } = await obterPessoa('a')

        const alturas = results.map(pessoa => parseInt(pessoa.height))
        console.log(alturas)

        // const total = alturas.reduce((anterior, proximo) => anterior + proximo)
        // const total = alturas.meuReduce((anterior, proximo) => anterior + proximo)
        const minhaLista = [
            ['Roberto', 'Arruda'],
            ['Laravel', 'Vue.JS']
        ]
        const total = minhaLista.meuReduce((anterior, proximo) => {
            return anterior.concat(proximo)
        }).join(', ')

        console.log('Total', total)
    } catch (error) {
        console.error('DEU RUIM', error)
    }
}

main()