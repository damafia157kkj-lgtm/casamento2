/* =========================================================
   casamentos.js — listagem de casamentos com pesquisa e
   ordenação (client-side, sobre os dados vindos da API).
   ========================================================= */

let TODOS_CASAMENTOS = [];

function renderizarLista(lista){
  const grid = document.getElementById("lista-grid");

  if(lista.length === 0){
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <p>Nenhum casamento encontrado com esses termos.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(c => `
    <a href="casamento-detalhes.html?id=${c.id}" class="wedding-card">
      <div class="photo" style="background-image:url('${c.foto}')">
        <span class="date-badge">${formatarData(c.data)}</span>
      </div>
      <div class="info">
        <h3>${c.noivo} &amp; ${c.noiva}</h3>
        <span class="meta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${c.local}, ${c.cidade}
        </span>
        <p class="desc">${c.descricao}</p>
        <span class="btn btn-outline btn-sm">Ver detalhes</span>
      </div>
    </a>
  `).join("");
}

function aplicarFiltros(){
  const termo = document.getElementById("busca-input").value.trim().toLowerCase();
  const ordenacao = document.getElementById("ordenar-select").value;

  let filtrados = TODOS_CASAMENTOS.filter(c => {
    const alvo = `${c.noivo} ${c.noiva} ${c.cidade} ${c.local}`.toLowerCase();
    return alvo.includes(termo);
  });

  filtrados.sort((a, b) => {
    if(ordenacao === "data-asc") return new Date(a.data) - new Date(b.data);
    if(ordenacao === "data-desc") return new Date(b.data) - new Date(a.data);
    if(ordenacao === "nome-asc") return a.noivo.localeCompare(b.noivo);
    return 0;
  });

  renderizarLista(filtrados);
}

async function init(){
  renderHeader("casamentos.html");
  renderFooter();
  TODOS_CASAMENTOS = await CasamentosAPI.listar();
  aplicarFiltros();

  document.getElementById("busca-input").addEventListener("input", aplicarFiltros);
  document.getElementById("ordenar-select").addEventListener("change", aplicarFiltros);
}

document.addEventListener("DOMContentLoaded", init);
