/* =========================================================
   main.js — lógica da página inicial: carrossel do hero
   e grade de casamentos em destaque.
   ========================================================= */

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop" },
  { img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1600&auto=format&fit=crop" },
  { img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop" }
];

let currentSlide = 0;
let carouselTimer = null;

function iniciarCarrossel(){
  const hero = document.getElementById("hero");
  const dotsWrap = document.getElementById("hero-dots");

  HERO_SLIDES.forEach((slide, i) => {
    const div = document.createElement("div");
    div.className = "hero-slide" + (i === 0 ? " active" : "");
    div.style.backgroundImage = `url('${slide.img}')`;
    hero.prepend(div);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir para slide ${i + 1}`);
    if(i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => irParaSlide(i));
    dotsWrap.appendChild(dot);
  });

  document.getElementById("hero-prev").addEventListener("click", () => irParaSlide(currentSlide - 1));
  document.getElementById("hero-next").addEventListener("click", () => irParaSlide(currentSlide + 1));

  carouselTimer = setInterval(() => irParaSlide(currentSlide + 1), 6000);
}

function irParaSlide(index){
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots button");
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => irParaSlide(currentSlide + 1), 6000);
}

async function carregarDestaques(){
  const grid = document.getElementById("destaques-grid");
  const casamentos = await CasamentosAPI.listar();
  const destaques = casamentos.slice(0, 3);

  if(destaques.length === 0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Nenhum casamento cadastrado ainda.</div>`;
    return;
  }

  grid.innerHTML = destaques.map(c => `
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

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("index.html");
  renderFooter();
  iniciarCarrossel();
  carregarDestaques();
});
