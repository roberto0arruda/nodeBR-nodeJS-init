const axios = require('axios')
const baseURL = `https://swapi.co/api/people`

async function obterPessoa(nome) {
    const url = `${baseURL}/?search=${nome}&format=json`
    const response = await axios.get(url)
    return response.data
}

module.exports = {
    obterPessoa
}