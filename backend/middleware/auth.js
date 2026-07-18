/* =========================================================
   middleware/auth.js — protege rotas que só o dono do site
   pode usar (cadastrar, editar, excluir). Exige um token
   válido, gerado no login, no cabeçalho Authorization.
   ========================================================= */

const jwt = require("jsonwebtoken");
require("dotenv").config();

function autenticar(req, res, next){
  const cabecalho = req.headers["authorization"];
  const token = cabecalho && cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if(!token){
    return res.status(401).json({ erro: "Faça login para realizar esta ação." });
  }

  try{
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados.usuario;
    next();
  }catch(err){
    return res.status(401).json({ erro: "Sessão expirada. Faça login novamente." });
  }
}

module.exports = autenticar;
