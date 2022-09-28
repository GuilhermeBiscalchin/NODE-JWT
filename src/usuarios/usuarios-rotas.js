const usuariosControlador = require("./usuarios-controlador");
const middlewaresAutenticacao = require("./middlewares-autenticacao")


module.exports = (app) => {
  app
    .route("/usuario/login")
    .post(
                         //Modificar o terceiro argumento do 'passport' - alterando o callback dele com o middlewares(um arquivo externo para tratar o erro, quando há login errado!)
      // passport.authenticate("local", { session: false }),
      //Substituir pelo middlewares de autenticação personalizado
      middlewaresAutenticacao.local,
      usuariosControlador.login
    );

  app
    .route("/usuario")
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route("/usuario/:id")
    .delete(
      //passport.authenticate("bearer", { session: false }),
      middlewaresAutenticacao.bearer,
      usuariosControlador.deleta
    );
};
