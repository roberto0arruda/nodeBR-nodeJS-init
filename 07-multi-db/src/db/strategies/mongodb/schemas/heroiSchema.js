const Mongoose = require('mongoose')

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

module.exports = Mongoose.model('herois', heroiSchema)