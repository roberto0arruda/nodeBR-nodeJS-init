/**
 * 0 Obter um usuário
 * 1 Obter numero de telefone do usuário pelo seu id
 * 2 Obter o endereço do usuário pelo seu id
 */

function obterUsuario(callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            nome: 'Aladin',
            dataNascimento: new Date()
        })
    }, 1000);
}

function obterTelefone(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            numero: '9919999999',
            ddd: 92
        })
    }, 3000);

}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        })
    }, 1000);

}

obterUsuario(function resolverUsuario(error, usuario) {
    // null || "" || 0 === false
    // else === true
    if (error) {
        console.error('DEU RUIM em USUÁRIO', error);
        return;
    }

    obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
        if (error1) {
            console.error('DEU RUIM em TELEFONE', error1);
            return;
        }

        obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
            if (error2) {
                console.error('DEU RUIM em ENDEREÇO', error2);
                return;
            }

            console.log(`
            Usuário: ${usuario.nome},
            Endereço: ${endereco.rua}, ${endereco.numero}
            Telefone: (${telefone.ddd}) ${telefone.numero}
            `)
        })
    })
})