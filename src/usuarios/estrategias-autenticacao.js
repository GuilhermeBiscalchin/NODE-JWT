const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcrypt');

//importando o Usuario, a partir do model

const Usuario = require('./usuarios-modelo')

//Erros customizados já implementado no projeto!
const {InvalidArgumentError} = require('../erros')

//função caso o usuario for nulo.
function verificaUsuario(usuario){
    if(!usuario){
        throw new InvalidArgumentError('Não Existe usuário com esse e-mail!');
    }
}

//Verificar se a senha do usuario é valida
async function verificaSenha(senha,senhaHash){
    const senhaValida = await bcrypt.compare(senha,senhaHash)
    if(!senhaValida){
        throw new InvalidArgumentError('E-mail ou senha inválida!')
    }
}

//criando o objeto para ser usado o nome do usuario como e-mail, senha e ter o tempo de sessão
passport.use(
    new LocalStrategy({
        usernameField:'email',
        passwordField:'senha',
        session:false

        //função de verificação, retornando o usuario se for válido, com o callback da autenticação.
    }, async (email,senha,done) => {

        try {
            //buscar o usuario a partir do email
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUsuario(usuario)
            await verificaSenha(senha,usuario.senhaHash)
            
            done(null,usuario);
            
        } catch (error) {
            done(error)
        }

    })
)