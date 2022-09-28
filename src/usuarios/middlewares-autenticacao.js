// Aqui vai ser criado o middlewares, que vai fazer a funçaõ do 'passaport' com os callbacks personalizados!

const passport = require("passport");


//exportar as funções que vai ser usada ao inves no 'passport'

module.exports = {
  //primeiro fazer a função da estratégia local.
  // pode passar a mesma estrutura que está na estratégia, como vai alterar apenas a função callback, nela vai personalizar.
  //Documentação do passport, recomenda fazer uma outra função, para acessar as informações do usuário para as modificações.
  //Chamando a função como mesmo argumento de 'req','res','next'.

  local: (req, res, next) => {
    passport.authenticate(
      "local",
      { session: false },
      (erro, usuario, info) => {
        //Primeira Tratativa de Erro, quando credenciais não válidas.
        //Passar uma condição.
        if (erro && erro.name === "InvalidArgumentError") {
          return res.status(401).json({ erro: erro.message });
        }

        //Uma trativa que pode englobar tudo que não tratamos no erro de cima.
        if (erro) {
          return res.status(500).json({ erro: erro.message });
        }

        //quando usuario é null, e não passa nem email e senha para a verificação dos dois erros acima.
        if (!usuario) {
          return res.status(401).json();
        }

        //quando esta tudo certo com o usuario
        req.user = usuario;
        return next();
      }
    )(req, res, next);
  },

  //Tratativa de Erro com Token!
  bearer: (req, res, next) => {
    passport.authenticate(
      "bearer",
      { session: false },
      (erro, usuario, info) => {
      if(erro && erro.name === 'JsonWebTokenError'){
        return res.status(401).json({erro: erro.message})
      }

      if(erro){
        return res.status(500).json({erro: erro.message})
      }

      if(!usuario){
        return res.status(401).json()
      }

        req.user = usuario;
        return next();
      }
    )(req, res, next);
  },
};
