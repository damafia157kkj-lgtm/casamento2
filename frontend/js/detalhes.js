/* =========================================================
   detalhes.js — carrega e exibe as informações completas
   de um único casamento (id vindo da URL: ?id=)
   ========================================================= */

function getIdDaUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function montarMenuHTML(itens, tipo){
  const filtrados = itens.filter(i => i.tipo === tipo);
  if(filtrados.length === 0){
    return `<p style="color:var(--ink-soft); font-size:.9rem;">Nenhum item cadastrado ainda.</p>`;
  }
  return `<div class="menu-list">
    ${filtrados.map(i => `
      <div class="menu-item">
        <div>
          <div class="name">${i.nome}</div>
          <div class="cat">${tipo === "comida" ? "Prato" : "Bebida"}</div>
        </div>
        <div class="price">${formatarPreco(i.preco)}</div>
      </div>
    `).join("")}
  </div>`;
}

function renderNaoEncontrado(){
  document.getElementById("conteudo").innerHTML = `
    <div class="section" style="text-align:center;">
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7.5-4.8-10.2-9.3C.2 8.7 1.4 5 5 4.2c2.1-.5 4 .5 5 2.3 1-1.8 2.9-2.8 5-2.3 3.6.8 4.8 4.5 3.2 7.5C19.5 16.2 12 21 12 21z"/></svg>
        <h3>Casamento não encontrado</h3>
        <p>O casamento que você procura não existe ou foi removido.</p>
        <a href="casamentos.html" class="btn btn-outline">Voltar para a lista</a>
      </div>
    </div>`;
}

async function init(){
  renderHeader("casamentos.html");
  renderFooter();

  const id = getIdDaUrl();
  if(!id){ renderNaoEncontrado(); return; }

  const c = await CasamentosAPI.buscarPorId(id);
  if(!c){ renderNaoEncontrado(); return; }

  document.title = `${c.noivo} & ${c.noiva} — Eterno Amor`;

  const itens = await ItensAPI.listar(c.id);

  document.getElementById("conteudo").innerHTML = `
    <section class="detail-hero" style="background-image:url('${c.foto}')">
      <div class="container detail-hero-content">
        <span class="eyebrow">${formatarData(c.data)} • ${c.horario}</span>
        <h1>${c.noivo} &amp; ${c.noiva}</h1>
        <span>${c.local}, ${c.cidade}</span>
      </div>
    </section>

    <div class="container">
      <div class="detail-grid">
        <div>
          <div class="detail-block">
            <h2>Sobre esta celebração</h2>
            <p style="color:var(--ink-soft);">${c.descricao}</p>
          </div>

          <div class="detail-block">
            <h2>Cardápio</h2>
            <div class="menu-tabs">
              <button class="menu-tab active" data-tab="comida">Comidas</button>
              <button class="menu-tab" data-tab="bebida">Bebidas</button>
            </div>
            <div id="menu-comida">${montarMenuHTML(itens, "comida")}</div>
            <div id="menu-bebida" style="display:none;">${montarMenuHTML(itens, "bebida")}</div>
          </div>
        </div>

        <div>
          <div class="detail-block">
            <h2>Informações</h2>
            <ul class="info-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
                <div><span class="label">Data</span><span class="value">${formatarData(c.data)}</span></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                <div><span class="label">Horário</span><span class="value">${c.horario}</span></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div><span class="label">Local</span><span class="value">${c.local}</span></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.8-10.2-9.3C.2 8.7 1.4 5 5 4.2c2.1-.5 4 .5 5 2.3 1-1.8 2.9-2.8 5-2.3 3.6.8 4.8 4.5 3.2 7.5C19.5 16.2 12 21 12 21z"/></svg>
                <div><span class="label">Cidade</span><span class="value">${c.cidade}</span></div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M17 3.5a4 4 0 010 7"/><path d="M1 21v-1a6 6 0 016-6h4a6 6 0 016 6v1M17 14a6 6 0 015 6v1"/></svg>
                <div><span class="label">Noivos</span><span class="value">${c.noivo} &amp; ${c.noiva}</span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div style="height:70px;"></div>
  `;

  document.querySelectorAll(".menu-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const alvo = tab.dataset.tab;
      document.getElementById("menu-comida").style.display = alvo === "comida" ? "block" : "none";
      document.getElementById("menu-bebida").style.display = alvo === "bebida" ? "block" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
