const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            method: 'GET',
            path: '/heroes',
            handler: (request, h) => {
                return this.db.read()
            }
        }
    }
}

module.exports = HeroRoutes