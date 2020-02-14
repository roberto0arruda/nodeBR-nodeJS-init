const ICrud = require('./base/interfaceDB')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._heroes = null
        this._connect()
    }

    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false
        }
    }

    async defineModel() {
        this._heroes = this._driver.define('heroes', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'TB_HEROES',
            freezeTableName: false,
            timestamps: false
        })
        // await Herois.sync()
    }

    async create(item) {
        const { dataValues } = await this._heroes.create(item)
        return dataValues
    }

    async read(item = {}) {
        return this._heroes.findAll({ where: item, raw: true })
    }

    async update(id, item) {
        return this._heroes.update(item, { where: { id } })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._heroes.destroy({ where: query })
    }

    _connect() {
        this._driver = new Sequelize(
            'heroes',
            'roberto',
            'minhasenhasecreta',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false
            }
        )
        this.defineModel()
    }
}

module.exports = Postgres