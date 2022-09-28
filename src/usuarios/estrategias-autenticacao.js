const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Usuario = require("./usuarios-modelo");

const { InvalidArgumentError } = require("../erros");

function verificaUsuario(usuario) {
  if (!usuario) {
    throw new InvalidArgumentError("Não Existe usuário com esse e-mail!");
  }
}

async function verificaSenha(senha, senhaHash) {
  const senhaValida = await bcrypt.compare(senha, senhaHash);
  if (!senhaValida) {
    throw new InvalidArgumentError("E-mail ou senha inválida!");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "senha",
      session: false,
    },
    async (email, senha, done) => {
      try {
        const usuario = await Usuario.buscaPorEmail(email);
        verificaUsuario(usuario);
        await verificaSenha(senha, usuario.senhaHash);

        done(null, usuario);
      } catch (error) {
        done(error);
      }
    }
  )
);

//Configurando a estrátegia com o Bearer
passport.use(
  new BearerStrategy(
    //Fazer uma funçao de verificação do token
    async (token, done) => {
      //Tratando o Erro

      try {
        const payload = jwt.verify(token, process.env.CHAVE_JWT);
        const usuario = await Usuario.buscaPorId(payload.id);
        done(null, usuario);
      } catch (erro) {
        done(erro);
      }
    }
  )
);
