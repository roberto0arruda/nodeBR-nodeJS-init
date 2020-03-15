const ICrud = require('./base/interfaceDB')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Discoctando',
}

class MongoDB extends ICrud {
    constructor() {
        super()
        this._heroes = null
        this._driver = null
    }

    async isConnected() {
        const state = STATUS[this._driver.readyState]

        if (state !== 'Conectando') return state
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readyState]
    }

    defineModel() {
        const heroiSchema = Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })

        this._heroes = Mongoose.model('herois', heroiSchema)
    }

    connect() {
        Mongoose.connect('mongodb://roberto:minhasenhasecreta@localhost:27017/heroes', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
            function (error) {
                if (!error) return
                console.log('Falha na conexão!', error)
            }
        )

        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!'))
        this._driver = connection
    }

    create(item) {
        console.log('O item foi salvo em MongoDB')
    }
}

module.exports = MongoDB