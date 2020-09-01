const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')

const HapiJwt = require('hapi-auth-jwt2')
const JWT_SECRET = 'MINHA_SENHA_SECRETA'

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
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: SwaggerOptions
        }
    ])

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: (dado, request) => {
            // verifica no banco se o usuário continua ativo
            // verifica no banco se o usuário continua pagando
            return {
                isValid: true // caso não valido false
            }
        }
    })

    server.auth.default('jwt')

    server.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ])

    await server.start()
    console.log('Servidor rodando na porta', server.info.port)

    return server
}

module.exports = main()