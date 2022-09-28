const Usuario = require("./usuarios-modelo.js");
const { InvalidArgumentError, InternalServerError } = require("../erros");

//importando jsonwebtoken, para gerar o token para do usuário.
const jwt = require("jsonwebtoken");

//função para criar o tokenJWT, recebendo o usuario, criando o payload para qual informação é necessária para gerar o JWT.
function criarJwtToken(usuario) {
  const payload = {
    id: usuario.id,
  };

  //Método Sign, do pacote jsonwebtoken, onde vai receber o token e assinar.
  //Utilizar o 'crypto' nativo do Node para gerar senhas aleatórias.
                                                                 //numero de caracteres para gerar a String     
  //No console executar - node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"
  //Essa maneira para substituir a senha secreta - não recomendado colocar a String gerada aqui no código.
  //Vai Substituir pela variável ambiente.
  const token = jwt.sign(payload, process.env.CHAVE_JWT)
  return token
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: (req, res) => {

    //antes de enviar a resposta do Login, criar o token, para chamar a função do JWT, recebendo o user, da autenticação.
    const token = criarJwtToken(req.user)
    //enviar o token, colocar no cabeçalho da Authorization,formulário padrão para envio do token.
    res.set('Authorization',token)
    res.status(204).send();
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },
};
