const postsControlador = require('./posts-controlador');
const {middlewaresAutenticacao} = require('../usuarios')

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      //passport.authenticate('bearer',{session: false})
      middlewaresAutenticacao.bearer
      , postsControlador.adiciona);
};
