/* =========================================================
   admin-casamentos.js — CRUD completo de casamentos:
   cadastrar, listar, pesquisar, editar e excluir.
   ========================================================= */

let LISTA_CASAMENTOS = [];
let idParaExcluir = null;

const campos = ["noivo", "noiva", "data", "horario", "local", "cidade", "foto", "descricao"];

/* ---------- Renderização da tabela ---------- */
function renderTabela(lista){
  const corpo = document.getElementById("tabela-corpo");

  if(lista.length === 0){
    corpo.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--ink-soft);">Nenhum casamento cadastrado.</td></tr>`;
    return;
  }

  corpo.innerHTML = lista.map(c => `
    <tr>
      <td><strong>${c.noivo} &amp; ${c.noiva}</strong></td>
      <td>${formatarData(c.data)}</td>
      <td>${c.local}</td>
      <td>${c.cidade}</td>
      <td>
        <div class="row-actions" style="justify-content:flex-end;">
          <button title="Ver no site" onclick="window.open('../casamento-detalhes.html?id=${c.id}','_blank')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button title="Editar" onclick="editarCasamento(${c.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button title="Excluir" class="danger" onclick="pedirExclusao(${c.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function filtrarTabela(){
  const termo = document.getElementById("busca-input").value.trim().toLowerCase();
  const filtrados = LISTA_CASAMENTOS.filter(c =>
    `${c.noivo} ${c.noiva} ${c.local} ${c.cidade}`.toLowerCase().includes(termo)
  );
  renderTabela(filtrados);
}

async function recarregarLista(){
  LISTA_CASAMENTOS = await CasamentosAPI.listar();
  filtrarTabela();
}

/* ---------- Formulário ---------- */
function abrirFormulario(modo, casamento){
  document.getElementById("form-card").style.display = "block";
  document.getElementById("form-titulo").textContent = modo === "editar" ? "Editar casamento" : "Novo casamento";
  document.getElementById("form-card").scrollIntoView({ behavior: "smooth", block: "start" });

  campos.forEach(c => document.getElementById(`f-${c}`).closest(".form-group").classList.remove("invalid"));

  if(modo === "editar" && casamento){
    document.getElementById("f-id").value = casamento.id;
    campos.forEach(c => document.getElementById(`f-${c}`).value = casamento[c] || "");
  }else{
    document.getElementById("form-casamento").reset();
    document.getElementById("f-id").value = "";
  }
}

function fecharFormulario(){
  document.getElementById("form-card").style.display = "none";
  document.getElementById("form-casamento").reset();
}

function editarCasamento(id){
  const c = LISTA_CASAMENTOS.find(c => c.id === id);
  if(c) abrirFormulario("editar", c);
}

function validarFormulario(){
  let ok = true;
  ok = validarCampo(document.getElementById("f-noivo"), { obrigatorio: true, min: 2 }) && ok;
  ok = validarCampo(document.getElementById("f-noiva"), { obrigatorio: true, min: 2 }) && ok;
  ok = validarCampo(document.getElementById("f-data"), { obrigatorio: true, tipo: "data" }) && ok;
  ok = validarCampo(document.getElementById("f-horario"), { obrigatorio: true }) && ok;
  ok = validarCampo(document.getElementById("f-local"), { obrigatorio: true, min: 2 }) && ok;
  ok = validarCampo(document.getElementById("f-cidade"), { obrigatorio: true, min: 2 }) && ok;
  ok = validarCampo(document.getElementById("f-foto"), { obrigatorio: true, min: 8 }) && ok;
  ok = validarCampo(document.getElementById("f-descricao"), { obrigatorio: true, min: 10 }) && ok;
  return ok;
}

async function salvarFormulario(e){
  e.preventDefault();
  if(!validarFormulario()){
    mostrarAlerta(document.getElementById("alerta-area"), "error", "Verifique os campos destacados antes de salvar.");
    return;
  }

  const dados = {};
  campos.forEach(c => dados[c] = document.getElementById(`f-${c}`).value.trim());
  const id = document.getElementById("f-id").value;

  try{
    if(id){
      await CasamentosAPI.atualizar(id, dados);
      mostrarAlerta(document.getElementById("alerta-area"), "success", "Casamento atualizado com sucesso!");
    }else{
      await CasamentosAPI.criar(dados);
      mostrarAlerta(document.getElementById("alerta-area"), "success", "Casamento cadastrado com sucesso!");
    }
    fecharFormulario();
    await recarregarLista();
  }catch(err){
    mostrarAlerta(document.getElementById("alerta-area"), "error", "Não foi possível salvar. Tente novamente.");
  }
}

/* ---------- Exclusão ---------- */
function pedirExclusao(id){
  idParaExcluir = id;
  document.getElementById("modal-excluir").classList.add("open");
}

async function confirmarExclusao(){
  if(idParaExcluir == null) return;
  await CasamentosAPI.excluir(idParaExcluir);
  document.getElementById("modal-excluir").classList.remove("open");
  mostrarAlerta(document.getElementById("alerta-area"), "success", "Casamento excluído.");
  idParaExcluir = null;
  await recarregarLista();
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  protegerPagina();
  renderAdminSidebar("casamentos.html");
  recarregarLista();

  document.getElementById("btn-novo").addEventListener("click", () => abrirFormulario("novo"));
  document.getElementById("btn-cancelar").addEventListener("click", fecharFormulario);
  document.getElementById("form-casamento").addEventListener("submit", salvarFormulario);
  document.getElementById("busca-input").addEventListener("input", filtrarTabela);

  document.getElementById("modal-cancelar").addEventListener("click", () => {
    document.getElementById("modal-excluir").classList.remove("open");
    idParaExcluir = null;
  });
  document.getElementById("modal-confirmar").addEventListener("click", confirmarExclusao);
});
