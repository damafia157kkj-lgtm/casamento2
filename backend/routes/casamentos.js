/* =========================================================
   routes/casamentos.js — CRUD de casamentos.
   Leitura (GET) é pública, pois o site precisa exibir os
   casamentos para qualquer visitante. Escrita (POST/PUT/DELETE)
   exige login, feito pelo middleware "autenticar".
   ========================================================= */

const express = require("express");
const pool = require("../config/db");
const autenticar = require("../middleware/auth");

const router = express.Router();

/* Listar todos */
router.get("/", async (req, res) => {
  try{
    const [linhas] = await pool.query(
      "SELECT * FROM casamentos ORDER BY data ASC"
    );
    res.json(linhas);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar casamentos." });
  }
});

/* Buscar um pelo id */
router.get("/:id", async (req, res) => {
  try{
    const [linhas] = await pool.query(
      "SELECT * FROM casamentos WHERE id = ?",
      [req.params.id]
    );
    if(linhas.length === 0){
      return res.status(404).json({ erro: "Casamento não encontrado." });
    }
    res.json(linhas[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar casamento." });
  }
});

/* Criar (protegido) */
router.post("/", autenticar, async (req, res) => {
  const { noivo, noiva, data, horario, local, cidade, foto, descricao } = req.body;

  if(!noivo || !noiva || !data || !horario || !local || !cidade || !foto || !descricao){
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
  }

  try{
    const [resultado] = await pool.query(
      `INSERT INTO casamentos (noivo, noiva, data, horario, local, cidade, foto, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [noivo, noiva, data, horario, local, cidade, foto, descricao]
    );
    const [novo] = await pool.query("SELECT * FROM casamentos WHERE id = ?", [resultado.insertId]);
    res.status(201).json(novo[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar casamento." });
  }
});

/* Atualizar (protegido) */
router.put("/:id", autenticar, async (req, res) => {
  const { noivo, noiva, data, horario, local, cidade, foto, descricao } = req.body;

  try{
    const [existe] = await pool.query("SELECT id FROM casamentos WHERE id = ?", [req.params.id]);
    if(existe.length === 0){
      return res.status(404).json({ erro: "Casamento não encontrado." });
    }

    await pool.query(
      `UPDATE casamentos SET noivo=?, noiva=?, data=?, horario=?, local=?, cidade=?, foto=?, descricao=?
       WHERE id = ?`,
      [noivo, noiva, data, horario, local, cidade, foto, descricao, req.params.id]
    );
    const [atualizado] = await pool.query("SELECT * FROM casamentos WHERE id = ?", [req.params.id]);
    res.json(atualizado[0]);
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar casamento." });
  }
});

/* Excluir (protegido) */
router.delete("/:id", autenticar, async (req, res) => {
  try{
    const [resultado] = await pool.query("DELETE FROM casamentos WHERE id = ?", [req.params.id]);
    if(resultado.affectedRows === 0){
      return res.status(404).json({ erro: "Casamento não encontrado." });
    }
    res.json({ mensagem: "Casamento excluído com sucesso." });
  }catch(err){
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir casamento." });
  }
});

module.exports = router;
