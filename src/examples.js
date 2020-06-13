class NotImplementedException extends Error {
    constructor() {
        super("Not Implemented Exception")
    }
}

class ICrud {
    create(item) {
        throw new NotImplementedException()
    }

    read(query) {
        throw new NotImplementedException()
    }

    update(id, item) {
        throw new NotImplementedException()
    }

    delete(id) {
        throw new NotImplementedException()
    }
}

class MongoDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em MongoDB')
    }
}

class Postgres extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em PostgresBD')
    }
}

class ContextStrategy {
    constructor(strategy) {
        this._databse = strategy
    }

    create(item) {
        return this._databse.create(item)
    }

    read(item) {
        return this._databse.read(item)
    }

    update(id, item) {
        return this._databse.update(id, item)
    }

    delete(id) {
        return this._databse.delete(id)
    }
}

const contextMongo = new ContextStrategy(new MongoDB())
contextMongo.create()


const contextPostgres = new ContextStrategy(new Postgres())
contextPostgres.create()