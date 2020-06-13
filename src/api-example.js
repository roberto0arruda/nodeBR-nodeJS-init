// npm i hapi
const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')

const server = new Hapi.Server({
    port: 5000
})

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    server.route([
        {
            method: 'GET',
            path: '/heroes',
            handler: (requet, h) => {
                return context.read()
            }
        }
    ])

    await server.start()
    console.log('Servidor rodando na porta ', server.info.port);

    return server
}

main()