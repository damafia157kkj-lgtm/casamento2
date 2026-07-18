/* =========================================================
   admin-layout.js — barra lateral da área administrativa,
   compartilhada entre as telas de cadastro.
   ========================================================= */

function renderAdminSidebar(activePage){
  const el = document.getElementById("admin-sidebar");
  if(!el) return;

  const links = [
    { href: "casamentos.html", label: "Casamentos", icon: `<path d="M12 21s-7.5-4.8-10.2-9.3C.2 8.7 1.4 5 5 4.2c2.1-.5 4 .5 5 2.3 1-1.8 2.9-2.8 5-2.3 3.6.8 4.8 4.5 3.2 7.5C19.5 16.2 12 21 12 21z"/>` },
    { href: "cardapio.html", label: "Comidas e bebidas", icon: `<path d="M4 19h16M6 19V9a2 2 0 012-2h8a2 2 0 012 2v10M9 19V13h6v6"/>` }
  ];

  el.innerHTML = `
    <div class="admin-sidebar">
      <a href="../index.html" class="brand" style="text-decoration:none;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;color:var(--gold-light);"><path d="M12 21s-7.5-4.8-10.2-9.3C.2 8.7 1.4 5 5 4.2c2.1-.5 4 .5 5 2.3 1-1.8 2.9-2.8 5-2.3 3.6.8 4.8 4.5 3.2 7.5C19.5 16.2 12 21 12 21z"/></svg>
        <span>Eterno Amor<small style="display:block;font-size:.65rem;opacity:.7;">Painel administrativo</small></span>
      </a>
      <nav>
        ${links.map(l => `
          <a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${l.icon}</svg>
            ${l.label}
          </a>
        `).join("")}
        <a href="../index.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>
          Voltar ao site
        </a>
        <a href="#" id="btn-sair">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </a>
      </nav>
    </div>
  `;

  document.getElementById("btn-sair").addEventListener("click", (e) => {
    e.preventDefault();
    AuthAPI.logout();
    window.location.href = "login.html";
  });
}

/* Validação simples e reutilizável de formulários */
function validarCampo(input, regra){
  const grupo = input.closest(".form-group");
  const valor = input.value.trim();
  let valido = true;

  if(regra.obrigatorio && valor === "") valido = false;
  if(valido && regra.min !== undefined && valor.length < regra.min) valido = false;
  if(valido && regra.tipo === "numero" && (isNaN(valor) || Number(valor) <= 0)) valido = false;
  if(valido && regra.tipo === "data" && valor === "") valido = false;

  grupo.classList.toggle("invalid", !valido);
  return valido;
}

function mostrarAlerta(container, tipo, mensagem){
  const iconeSucesso = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>`;
  const iconeErro = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>`;
  container.innerHTML = `
    <div class="alert alert-${tipo}">
      ${tipo === "success" ? iconeSucesso : iconeErro}
      <span>${mensagem}</span>
    </div>`;
  setTimeout(() => { container.innerHTML = ""; }, 4000);
}
