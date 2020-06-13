const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')

const server = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    server.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])

    await server.start()
    console.log('Servidor rodando na porta', server.info.port);

    return server
}

module.exports = main()