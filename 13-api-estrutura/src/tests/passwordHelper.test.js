const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'roberto@123123'
const HASH = '$2b$04$4gYgsT1PKxoYLzPXVeuDKORE.VkyI8bgcUp06cI1iup6k3FwgNrvS'

describe('UserHelper test suite', function() {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)

        assert.ok(result.length > 32)
    })


    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)

        assert.ok(result)
    })
})