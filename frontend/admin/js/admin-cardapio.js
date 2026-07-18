/* =========================================================
   admin-cardapio.js — CRUD completo de comidas e bebidas,
   sempre vinculadas a um casamento (chave estrangeira).
   ========================================================= */

let LISTA_ITENS = [];
let LISTA_CASAMENTOS = [];
let idParaExcluir = null;

function nomeCasamento(id){
  const c = LISTA_CASAMENTOS.find(c => String(c.id) === String(id));
  return c ? `${c.noivo} & ${c.noiva}` : "—";
}

function preencherSelectsDeCasamento(){
  const opcoes = LISTA_CASAMENTOS.map(c => `<option value="${c.id}">${c.noivo} &amp; ${c.noiva}</option>`).join("");
  document.getElementById("f-casamento").innerHTML = opcoes || `<option value="">Nenhum casamento cadastrado</option>`;
  document.getElementById("filtro-casamento").innerHTML = `<option value="">Todos os casamentos</option>` + opcoes;
}

function renderTabela(lista){
  const corpo = document.getElementById("tabela-corpo");
  if(lista.length === 0){
    corpo.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--ink-soft);">Nenhum item cadastrado.</td></tr>`;
    return;
  }
  corpo.innerHTML = lista.map(i => `
    <tr>
      <td><strong>${i.nome}</strong></td>
      <td><span class="badge badge-${i.tipo}">${i.tipo === "comida" ? "Comida" : "Bebida"}</span></td>
      <td>${nomeCasamento(i.casamento_id)}</td>
      <td>${formatarPreco(i.preco)}</td>
      <td>
        <div class="row-actions" style="justify-content:flex-end;">
          <button title="Editar" onclick="editarItem(${i.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button title="Excluir" class="danger" onclick="pedirExclusao(${i.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function filtrarTabela(){
  const termo = document.getElementById("busca-input").value.trim().toLowerCase();
  const casamentoId = document.getElementById("filtro-casamento").value;
  const tipo = document.getElementById("filtro-tipo").value;

  const filtrados = LISTA_ITENS.filter(i => {
    const bateNome = i.nome.toLowerCase().includes(termo);
    const bateCasamento = !casamentoId || String(i.casamento_id) === String(casamentoId);
    const bateTipo = !tipo || i.tipo === tipo;
    return bateNome && bateCasamento && bateTipo;
  });
  renderTabela(filtrados);
}

async function recarregarTudo(){
  LISTA_CASAMENTOS = await CasamentosAPI.listar();
  LISTA_ITENS = await ItensAPI.listar();
  preencherSelectsDeCasamento();
  filtrarTabela();
}

/* ---------- Formulário ---------- */
function abrirFormulario(modo, item){
  document.getElementById("form-card").style.display = "block";
  document.getElementById("form-titulo").textContent = modo === "editar" ? "Editar item" : "Novo item";
  document.getElementById("form-card").scrollIntoView({ behavior: "smooth", block: "start" });

  ["nome","preco","casamento"].forEach(c => document.getElementById(`f-${c}`).closest(".form-group").classList.remove("invalid"));

  if(modo === "editar" && item){
    document.getElementById("f-id").value = item.id;
    document.getElementById("f-nome").value = item.nome;
    document.getElementById("f-tipo").value = item.tipo;
    document.getElementById("f-preco").value = item.preco;
    document.getElementById("f-casamento").value = item.casamento_id;
  }else{
    document.getElementById("form-item").reset();
    document.getElementById("f-id").value = "";
  }
}

function fecharFormulario(){
  document.getElementById("form-card").style.display = "none";
  document.getElementById("form-item").reset();
}

function editarItem(id){
  const item = LISTA_ITENS.find(i => i.id === id);
  if(item) abrirFormulario("editar", item);
}

function validarFormulario(){
  let ok = true;
  ok = validarCampo(document.getElementById("f-nome"), { obrigatorio: true, min: 2 }) && ok;
  ok = validarCampo(document.getElementById("f-preco"), { obrigatorio: true, tipo: "numero" }) && ok;
  ok = validarCampo(document.getElementById("f-casamento"), { obrigatorio: true }) && ok;
  return ok;
}

async function salvarFormulario(e){
  e.preventDefault();
  if(LISTA_CASAMENTOS.length === 0){
    mostrarAlerta(document.getElementById("alerta-area"), "error", "Cadastre um casamento antes de adicionar itens ao cardápio.");
    return;
  }
  if(!validarFormulario()){
    mostrarAlerta(document.getElementById("alerta-area"), "error", "Verifique os campos destacados antes de salvar.");
    return;
  }

  const dados = {
    nome: document.getElementById("f-nome").value.trim(),
    tipo: document.getElementById("f-tipo").value,
    preco: parseFloat(document.getElementById("f-preco").value),
    casamento_id: document.getElementById("f-casamento").value
  };
  const id = document.getElementById("f-id").value;

  try{
    if(id){
      await ItensAPI.atualizar(id, dados);
      mostrarAlerta(document.getElementById("alerta-area"), "success", "Item atualizado com sucesso!");
    }else{
      await ItensAPI.criar(dados);
      mostrarAlerta(document.getElementById("alerta-area"), "success", "Item cadastrado com sucesso!");
    }
    fecharFormulario();
    await recarregarTudo();
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
  await ItensAPI.excluir(idParaExcluir);
  document.getElementById("modal-excluir").classList.remove("open");
  mostrarAlerta(document.getElementById("alerta-area"), "success", "Item excluído.");
  idParaExcluir = null;
  await recarregarTudo();
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  protegerPagina();
  renderAdminSidebar("cardapio.html");
  recarregarTudo();

  document.getElementById("btn-novo").addEventListener("click", () => abrirFormulario("novo"));
  document.getElementById("btn-cancelar").addEventListener("click", fecharFormulario);
  document.getElementById("form-item").addEventListener("submit", salvarFormulario);
  document.getElementById("busca-input").addEventListener("input", filtrarTabela);
  document.getElementById("filtro-casamento").addEventListener("change", filtrarTabela);
  document.getElementById("filtro-tipo").addEventListener("change", filtrarTabela);

  document.getElementById("modal-cancelar").addEventListener("click", () => {
    document.getElementById("modal-excluir").classList.remove("open");
    idParaExcluir = null;
  });
  document.getElementById("modal-confirmar").addEventListener("click", confirmarExclusao);
});
