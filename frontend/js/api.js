/* =========================================================
   api.js — Camada única de acesso a dados.
   Todo o front-end fala com o back-end através das funções
   deste arquivo (fetch para a API REST em Node/Express).
   Se a API não responder (ex.: rodando o front sozinho),
   cai automaticamente em dados de exemplo salvos no
   localStorage, para que as telas continuem funcionáveis
   durante o desenvolvimento.
   ========================================================= */

const API_BASE_URL = "http://localhost:3000/api";

/* ---------- Autenticação (login do dono do site) ---------- */
const AuthAPI = {
  async login(usuario, senha){
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    });
    const dados = await res.json();
    if(!res.ok) throw new Error(dados.erro || "Não foi possível entrar.");
    localStorage.setItem("admin_token", dados.token);
    return dados.token;
  },

  logout(){
    localStorage.removeItem("admin_token");
  },

  estaLogado(){
    return !!localStorage.getItem("admin_token");
  },

  getToken(){
    return localStorage.getItem("admin_token");
  }
};

/* ---------- Dados de exemplo (usados só como fallback) ---------- */
const SEED_CASAMENTOS = [
  {
    id: 1,
    noivo: "Arthur Carvalho",
    noiva: "Camila Ferraz",
    data: "2026-09-12",
    horario: "17:00",
    local: "Espaço Villa Jardim",
    cidade: "Belo Horizonte - MG",
    descricao: "Uma cerimônia ao ar livre entre jardins, seguida de recepção à luz de velas.",
    foto: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    noivo: "Rafael Souza",
    noiva: "Beatriz Lima",
    data: "2026-10-03",
    horario: "16:30",
    local: "Fazenda Boa Vista",
    cidade: "Contagem - MG",
    descricao: "Casamento rústico com decoração de campo e festa até o amanhecer.",
    foto: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    noivo: "Lucas Andrade",
    noiva: "Fernanda Rocha",
    data: "2026-11-21",
    horario: "18:00",
    local: "Salão Cristal",
    cidade: "Nova Lima - MG",
    descricao: "Elegância clássica em salão de cristal com jantar completo.",
    foto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
  }
];

const SEED_ITENS = [
  { id: 1, casamento_id: 1, nome: "Filé ao Molho Madeira", tipo: "comida", preco: 68.0 },
  { id: 2, casamento_id: 1, nome: "Risoto de Camarão", tipo: "comida", preco: 74.0 },
  { id: 3, casamento_id: 1, nome: "Espumante Brut", tipo: "bebida", preco: 45.0 },
  { id: 4, casamento_id: 2, nome: "Costela no Bafo", tipo: "comida", preco: 58.0 },
  { id: 5, casamento_id: 2, nome: "Caipirinha de Frutas", tipo: "bebida", preco: 22.0 },
  { id: 6, casamento_id: 3, nome: "Salmão Grelhado", tipo: "comida", preco: 79.0 },
  { id: 7, casamento_id: 3, nome: "Taça de Vinho Tinto", tipo: "bebida", preco: 32.0 }
];

function seedLocalStorage(){
  if(!localStorage.getItem("casamentos")) localStorage.setItem("casamentos", JSON.stringify(SEED_CASAMENTOS));
  if(!localStorage.getItem("itens")) localStorage.setItem("itens", JSON.stringify(SEED_ITENS));
}
seedLocalStorage();

function nextId(arr){ return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1; }

/* ---------- Helper genérico de fetch com fallback ---------- */
async function tryApi(path, options = {}){
  try{
    const token = AuthAPI.getToken();
    const headers = { ...(options.headers || {}) };
    if(token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if(!res.ok) throw new Error("Falha na API");
    return await res.json();
  }catch(err){
    return null; // sinaliza para quem chamou usar o fallback local
  }
}

/* ======================= CASAMENTOS ======================= */
const CasamentosAPI = {
  async listar(){
    const api = await tryApi("/casamentos");
    if(api) return api;
    return JSON.parse(localStorage.getItem("casamentos") || "[]");
  },

  async buscarPorId(id){
    const api = await tryApi(`/casamentos/${id}`);
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("casamentos") || "[]");
    return lista.find(c => String(c.id) === String(id)) || null;
  },

  async criar(dados){
    const api = await tryApi("/casamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("casamentos") || "[]");
    const novo = { ...dados, id: nextId(lista) };
    lista.push(novo);
    localStorage.setItem("casamentos", JSON.stringify(lista));
    return novo;
  },

  async atualizar(id, dados){
    const api = await tryApi(`/casamentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("casamentos") || "[]");
    const idx = lista.findIndex(c => String(c.id) === String(id));
    if(idx > -1) lista[idx] = { ...lista[idx], ...dados };
    localStorage.setItem("casamentos", JSON.stringify(lista));
    return lista[idx];
  },

  async excluir(id){
    const api = await tryApi(`/casamentos/${id}`, { method: "DELETE" });
    if(api) return true;
    let lista = JSON.parse(localStorage.getItem("casamentos") || "[]");
    lista = lista.filter(c => String(c.id) !== String(id));
    localStorage.setItem("casamentos", JSON.stringify(lista));
    let itens = JSON.parse(localStorage.getItem("itens") || "[]");
    itens = itens.filter(i => String(i.casamento_id) !== String(id));
    localStorage.setItem("itens", JSON.stringify(itens));
    return true;
  }
};

/* ======================= ITENS (COMIDAS / BEBIDAS) ======================= */
const ItensAPI = {
  async listar(casamentoId){
    const path = casamentoId ? `/itens?casamento_id=${casamentoId}` : "/itens";
    const api = await tryApi(path);
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("itens") || "[]");
    return casamentoId ? lista.filter(i => String(i.casamento_id) === String(casamentoId)) : lista;
  },

  async criar(dados){
    const api = await tryApi("/itens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("itens") || "[]");
    const novo = { ...dados, id: nextId(lista) };
    lista.push(novo);
    localStorage.setItem("itens", JSON.stringify(lista));
    return novo;
  },

  async atualizar(id, dados){
    const api = await tryApi(`/itens/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if(api) return api;
    const lista = JSON.parse(localStorage.getItem("itens") || "[]");
    const idx = lista.findIndex(i => String(i.id) === String(id));
    if(idx > -1) lista[idx] = { ...lista[idx], ...dados };
    localStorage.setItem("itens", JSON.stringify(lista));
    return lista[idx];
  },

  async excluir(id){
    const api = await tryApi(`/itens/${id}`, { method: "DELETE" });
    if(api) return true;
    let lista = JSON.parse(localStorage.getItem("itens") || "[]");
    lista = lista.filter(i => String(i.id) !== String(id));
    localStorage.setItem("itens", JSON.stringify(lista));
    return true;
  }
};

/* ---------- Utilidades compartilhadas ---------- */
function formatarData(dataStr){
  if(!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${dia} ${meses[parseInt(mes,10)-1]}. ${ano}`;
}

function formatarPreco(valor){
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
