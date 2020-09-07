const ICrud = require('./../base/interfaceDB')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor(connetion, scheme) {
        super()
        this._connection = connetion
        this._schema = scheme
    }

    async isConnected () {
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false
        }
    }

    static async defineModel (connetion, schema) {
        const model = connetion.define(schema.name, schema.schema, schema.options)
        await model.sync()
        return model
    }

    async create (item) {
        const { dataValues } = await this._schema.create(item)
        return dataValues
    }

    async read (item = {}) {
        return this._schema.findAll({ where: item, raw: true })
    }

    async update (id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return this._schema[fn](item, { where: { id } })
    }

    async delete (id) {
        const query = id ? { id } : {}
        return this._schema.destroy({ where: query })
    }

    static async connect () {
        return new Sequelize(
            'heroes',
            'roberto',
            'minhasenhasecreta',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                logging: false
            }
        )
    }
}

module.exports = Postgres