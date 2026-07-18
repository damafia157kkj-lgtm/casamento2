/* =========================================================
   routes/auth.js — login do dono do site. Não existe
   cadastro de usuário: só há um administrador, configurado
   por variáveis de ambiente (ADMIN_USER / ADMIN_PASSWORD_*).
   ========================================================= */

const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

function senhaConfere(senhaDigitada){
  const hashDigitado = crypto
    .scryptSync(senhaDigitada, process.env.ADMIN_PASSWORD_SALT, 64)
    .toString("hex");

  const bufferDigitado = Buffer.from(hashDigitado, "hex");
  const bufferEsperado = Buffer.from(process.env.ADMIN_PASSWORD_HASH, "hex");

  if(bufferDigitado.length !== bufferEsperado.length) return false;
  return crypto.timingSafeEqual(bufferDigitado, bufferEsperado);
}

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if(!usuario || !senha){
    return res.status(400).json({ erro: "Informe usuário e senha." });
  }

  const usuarioCorreto = usuario.trim().toLowerCase() === process.env.ADMIN_USER.toLowerCase();
  const senhaCorreta = usuarioCorreto && senhaConfere(senha);

  if(!usuarioCorreto || !senhaCorreta){
    return res.status(401).json({ erro: "Usuário ou senha incorretos." });
  }

  const token = jwt.sign(
    { usuario: process.env.ADMIN_USER },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

module.exports = router;
