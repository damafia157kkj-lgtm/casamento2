/* =========================================================
   server.js — ponto de entrada do backend.
   ========================================================= */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rotasAuth = require("./routes/auth");
const rotasCasamentos = require("./routes/casamentos");
const rotasItens = require("./routes/itens");

const app = express();

app.use(cors());
app.use(express.json());

// Log simples de cada requisição (ajuda a depurar durante o desenvolvimento)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString("pt-BR")} — ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Site de Casamento no ar!" });
});

app.use("/api", rotasAuth);
app.use("/api/casamentos", rotasCasamentos);
app.use("/api/itens", rotasItens);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
