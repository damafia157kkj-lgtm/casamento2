/* =========================================================
   layout.js — injeta o cabeçalho e o rodapé em todas as
   páginas públicas, evitando duplicar HTML.
   Cada página só precisa ter <div id="site-header"></div>
   e <div id="site-footer"></div>.
   ========================================================= */

const HEART_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.8-10.2-9.3C.2 8.7 1.4 5 5 4.2c2.1-.5 4 .5 5 2.3 1-1.8 2.9-2.8 5-2.3 3.6.8 4.8 4.5 3.2 7.5C19.5 16.2 12 21 12 21z"/></svg>`;

function renderHeader(activePage){
  const el = document.getElementById("site-header");
  if(!el) return;
  const links = [
    { href: "index.html", label: "Início" },
    { href: "casamentos.html", label: "Casamentos" }
  ];
  el.innerHTML = `
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="brand">
          ${HEART_ICON}
          <span>Eterno Amor<small>Celebrações &amp; Casamentos</small></span>
        </a>
        <nav class="nav-links" id="nav-links">
          ${links.map(l => `<a href="${l.href}" class="${activePage === l.href ? 'active' : ''}">${l.label}</a>`).join("")}
          <a href="admin/login.html" class="btn btn-outline btn-sm">Área administrativa</a>
        </nav>
        <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderFooter(){
  const el = document.getElementById("site-footer");
  if(!el) return;
  const ano = new Date().getFullYear();
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Eterno Amor</div>
            <p>Um espaço dedicado a celebrar histórias de amor, reunindo os detalhes de cada casamento em um só lugar — do convite ao brinde final.</p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              <li><a href="index.html">Início</a></li>
              <li><a href="casamentos.html">Casamentos</a></li>
              <li><a href="admin/login.html">Área administrativa</a></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li>contato@eternoamor.com.br</li>
              <li>(31) 99999-0000</li>
              <li>Belo Horizonte - MG</li>
            </ul>
          </div>
          <div>
            <h4>Siga</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${ano} Eterno Amor. Todos os direitos reservados.</span>
          <span>Feito com ${HEART_ICON.replace('width="24" height="24"','width="12" height="12"')} para celebrar o amor.</span>
        </div>
      </div>
    </footer>
  `;
}
