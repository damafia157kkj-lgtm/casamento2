/* =========================================================
   admin-auth.js — tela de login e proteção das demais
   páginas do painel administrativo.
   ========================================================= */

/* Chamada no topo de cada página protegida (casamentos.html,
   cardapio.html): se não houver login válido, manda para a
   tela de login. */
function protegerPagina(){
  if(!AuthAPI.estaLogado()){
    window.location.href = "login.html";
  }
}

async function tratarLogin(e){
  e.preventDefault();
  const usuario = document.getElementById("f-usuario");
  const senha = document.getElementById("f-senha");

  let ok = true;
  ok = validarCampo(usuario, { obrigatorio: true }) && ok;
  ok = validarCampo(senha, { obrigatorio: true }) && ok;
  if(!ok) return;

  const botao = e.target.querySelector("button[type=submit]");
  botao.disabled = true;
  botao.textContent = "Entrando...";

  try{
    await AuthAPI.login(usuario.value.trim(), senha.value);
    window.location.href = "casamentos.html";
  }catch(err){
    mostrarAlerta(document.getElementById("alerta-area"), "error", err.message || "Usuário ou senha incorretos.");
    botao.disabled = false;
    botao.textContent = "Entrar";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  if(!formLogin) return; // não é a tela de login, não faz nada aqui

  // Se já estiver logado e cair na tela de login, manda direto pro painel
  if(AuthAPI.estaLogado()){
    window.location.href = "casamentos.html";
    return;
  }
  formLogin.addEventListener("submit", tratarLogin);
});