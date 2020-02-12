const Commander = require('commander')
const Database = require('./database')
const Heroi = require('./heroi')

async function main() {
    Commander.version('v1')
        .option('-n, --nome [value]', 'adicionar nome')
        .option('-p, --poder [value]', 'adicionar poder')

        //CRUD
        .option('-c, --cadastrar', 'cadastrar Heroi')
        .option('-r, --listar [value]', 'listar herois pelo id')
        .option('-u, --atualizar [value]', 'atualizar heroi pelo id')
        .option('-d, --remover [value]', 'remover heroi pelo id')

        .parse(process.argv)

    const heroi = new Heroi(Commander)

    try {
        if (Commander.cadastrar) {
            delete heroi.id
            const resultado = await Database.cadastrar(heroi)
            if (!resultado) {
                console.error('Não foi cadastrado o heroi!')
                return
            }
            console.log('Heroi cadastrado com sucesso!')
        }

        if (Commander.listar) {
            const resultado = await Database.listar()
            console.log(resultado)
            return
        }

        if (Commander.remover) {
            console.log(heroi, parseInt(heroi.id))
            const resultado = await Database.remover(heroi.id)
            if (!resultado) {
                console.error('Não foi possivel remover o heroi!')
                return
            }
            console.log('Heroi removido com sucesso!')
        }

        if (Commander.atualizar) {
            const idParaAtualizar = parseInt(Commander.atualizar)

            // remover todas as chaves que estiverem com undefined || null
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)
            if (!resultado) {
                console.error('Não foi possivel atualizar o heroi!')
                return
            }
            console.log('Heroi atualizado com sucesso!')
        }

    } catch (error) {
        console.error('DEU RUIM', error)
    }
}
main()









