const ICrud = require('./../base/interfaceDB')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando',
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected () {
        const state = STATUS[this._connection.readyState]

        if (state !== 'Conectando') return state
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect () {
        Mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
            function (error) {
                if (!error) return
                console.log('Falha na conexão!', error)
            }
        )

        const connection = Mongoose.connection

        return connection.once('open', () => console.log('database rodando!'))
    }

    create (item) {
        return this._schema.create(item)
    }

    read (item, skip = 0, limit = 10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

    update (id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete (id) {
        return this._schema.deleteOne({ _id: id })
    }
}

module.exports = MongoDB