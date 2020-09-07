const Hapi = require('hapi')
const contextStrategy = require('./db/strategies/base/contextStrategy')

const MongoDBStrategy = require('./db/strategies/mongodb/mongoDBStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')

const PostgresSQLStrategy = require('./db/strategies/postgres/postgresSQLStrategy')
const UsuarioSchema = require('./db/strategies/postgres/schemas/UsuarioSchema')

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
    const mongoConnection = MongoDBStrategy.connect()
    const contextMongo = new contextStrategy(new MongoDBStrategy(mongoConnection, HeroiSchema))

    const postgresConnection = await PostgresSQLStrategy.connect()
    const model = await PostgresSQLStrategy.defineModel(postgresConnection, UsuarioSchema)
    const contextPostgres = new contextStrategy(new PostgresSQLStrategy(postgresConnection, model))


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
        validate: async (dado, request) => {
            const [result] = await contextPostgres.read({
                id: dado.id,
                username: dado.username.toLowerCase()
            })
            if (!result) {
                return {
                    isValid: false
                }
            }
            // verifica no banco se o usuário continua ativo
            // verifica no banco se o usuário continua pagando
            return {
                isValid: true // caso não valido false
            }
        }
    })

    server.auth.default('jwt')

    server.route([
        ...mapRoutes(new HeroRoute(contextMongo), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
    ])

    await server.start()
    console.log('Servidor rodando na porta', server.info.port)

    return server
}

module.exports = main()