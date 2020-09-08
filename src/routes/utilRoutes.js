const BaseRoute = require('./base/baseRoute')

const { join } = require('path')

class UtilRoutes extends BaseRoute {
    coverage () {
        return {
            method: 'GET',
            path: '/coverage/{param*}',
            config: {
                auth: false
            },
            handler: {
                directory: {
                    path: join(__dirname, '..', '..', 'coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}

module.exports = UtilRoutes