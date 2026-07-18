/* =========================================================
   routes/itens.js — CRUD de comidas e bebidas, sempre
   vinculadas a um casamento (chave estrangeira casamento_id).
   ========================================================= */

const express = require("express");
const pool = require("../config/db");
const autenticar = require("../middleware/auth");

const router = express.Router();

/* Listar (opcionalmente filtrando por ?casamento_id=) */
router.get("/", async (req, res) => {
  try{
    const { casamento_id } = req.query;
    const sql = casamento_id
      ? "SELECT * FROM itens WHERE casamento_id = ? ORDER BY tipo, nome"
      : "SELECT * FROM itens ORDER BY tipo, nome";
    const params = casamento_id ? [casamento_id] : [];
    const [linhas] = await pool.query(sql, params);
    res.json(linhas);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar itens." });
  }
});

/* Criar (protegido) */
router.post("/", autenticar, async (req, res) => {
  const { casamento_id, nome, tipo, preco } = req.body;

  if(!casamento_id || !nome || !tipo || preco === undefined){
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }
  if(!["comida", "bebida"].includes(tipo)){
    return res.status(400).json({ erro: "Tipo deve ser 'comida' ou 'bebida'." });
  }

  try{
    const [resultado] = await pool.query(
      "INSERT INTO itens (casamento_id, nome, tipo, preco) VALUES (?, ?, ?, ?)",
      [casamento_id, nome, tipo, preco]
    );
    const [novo] = await pool.query("SELECT * FROM itens WHERE id = ?", [resultado.insertId]);
    res.status(201).json(novo[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar item." });
  }
});

/* Atualizar (protegido) */
router.put("/:id", autenticar, async (req, res) => {
  const { casamento_id, nome, tipo, preco } = req.body;

  try{
    const [existe] = await pool.query("SELECT id FROM itens WHERE id = ?", [req.params.id]);
    if(existe.length === 0){
      return res.status(404).json({ erro: "Item não encontrado." });
    }

    await pool.query(
      "UPDATE itens SET casamento_id=?, nome=?, tipo=?, preco=? WHERE id = ?",
      [casamento_id, nome, tipo, preco, req.params.id]
    );
    const [atualizado] = await pool.query("SELECT * FROM itens WHERE id = ?", [req.params.id]);
    res.json(atualizado[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar item." });
  }
});

/* Excluir (protegido) */
router.delete("/:id", autenticar, async (req, res) => {
  try{
    const [resultado] = await pool.query("DELETE FROM itens WHERE id = ?", [req.params.id]);
    if(resultado.affectedRows === 0){
      return res.status(404).json({ erro: "Item não encontrado." });
    }
    res.json({ mensagem: "Item excluído com sucesso." });
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir item." });
  }
});

module.exports = router;
