const { get } = require('axios')
const baseURL = `https://swapi.co/api/people`

async function obterPessoa(nome) {
    const url = `${baseURL}/?search=${nome}&format=json`
    const { data } = await get(url)
    return data.results.map(mapearPessoa)
}

function mapearPessoa(item) {
    return {
        nome: item.name,
        altura: item.height
    }
}

module.exports = {
    obterPessoa
}