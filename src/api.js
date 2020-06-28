const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')

const server = new Hapi.Server({
    port: 5000
})

function mapRoutes (instance, methods) {
    return methods.map(method => instance[method]())
}

async function main () {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchema))

    const SwaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await server.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: SwaggerOptions
        }
    ])

    server.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()))

    await server.start()
    console.log('Servidor rodando na porta', server.info.port)

    return server
}

module.exports = main()