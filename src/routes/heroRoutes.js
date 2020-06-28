const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const { boomify } = require('boom')

const failAction = (request, h, erro) => {
    throw erro
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list () {
        return {
            method: 'GET',
            path: '/heroes',
            config: {
                tags: ['api'],
                description: 'Deve listar herois',
                notes: 'pode paginar resultados e filtrar por nome',
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> na URL :id
                    // query -> ?skip=3&limit=10
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, h) => {
                try {
                    const { skip, limit, nome } = request.query

                    const query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }

                    return this.db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    create () {
        return {
            method: 'POST',
            path: '/heroes',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar heroi',
                notes: 'pode cadastrar um heroi com nome  poder',
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })

                    return {
                        message: 'Heroi Cadastrado com sucesso!',
                        _id: result._id
                    }
                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    update () {
        return {
            method: 'PATCH',
            path: '/heroes/{id}',
            config: {
                tags: ['api'],
                description: 'Deve atualizar um heroi pelo id',
                notes: 'pode atuaizar qualquer campo',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('Não foi possivel atualizar!')

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    delete () {
        return {
            method: 'DELETE',
            path: '/heroes/{id}',
            config: {
                tags: ['api'],
                description: 'Deve deletar um heroi pelo id',
                notes: 'pode deletar heroi',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params

                    const result = await this.db.delete(id)

                    if (result.n !== 1) return Boom.preconditionFailed('Não foi possivel remover item!')

                    return {
                        message: 'Heroi removido com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes