/**
 * 0 Obter um usuário
 * 1 Obter numero de telefone do usuário pelo seu id
 * 2 Obter o endereço do usuário pelo seu id
 */

// importa modulo interno do node.js
const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    // quando der algum problema chamar -> reject(ERRO)
    // quando der sucesso chamar -> resolve
    return new Promise(function resolvePromise(resolve, reject) {

        setTimeout(() => {
            // return reject(new Error('DEU RUIM DE VERDADE!'))

            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000);
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                numero: '9919999999',
                ddd: 92
            })
        }, 1500);
    })
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        })
    }, 1000);

}

const usuarioPromise = obterUsuario()

usuarioPromise
    .then(function (usuario) {
        return obterTelefone(usuario.id)
            .then(function resolverTelefone(result) {
                return {
                    usuario: {
                        nome: usuario.nome,
                        id: usuario.id
                    },
                    telefone: result
                }
            })
    })
    .then(function (resultado) {
        const endereco = obterEnderecoAsync(resultado.usuario.id)
        return endereco.then(function resolverEndereco(result) {
            return {
                usuario: resultado.usuario,
                telefone: resultado.telefone,
                endereco: result
            }
        })
    })
    .then(function (resultado) {
        console.log(`
            Nome: ${resultado.usuario.nome},
            Endereço: ${resultado.endereco.rua}, ${resultado.endereco.numero}
            Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.numero}
        `)
    }).catch(function (error) {
        console.log('erro', error);
    })

// obterUsuario(function resolverUsuario(error, usuario) {
//     // null || "" || 0 === false
//     // else === true
//     if (error) {
//         console.error('DEU RUIM em USUÁRIO', error);
//         return;
//     }

//     obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
//         if (error1) {
//             console.error('DEU RUIM em TELEFONE', error1);
//             return;
//         }

//         obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
//             if (error2) {
//                 console.error('DEU RUIM em ENDEREÇO', error2);
//                 return;
//             }

//             console.log(`
//             Usuário: ${usuario.nome},
//             Endereço: ${endereco.rua}, ${endereco.numero}
//             Telefone: (${telefone.ddd}) ${telefone.numero}
//             `)
//         })
//     })
// })