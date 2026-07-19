# 💍 Eterno Amor — Site de Casamento

Sistema web para divulgação e organização de celebrações de casamento. A área pública exibe os casamentos cadastrados (data, local, cardápio de comidas e bebidas), e a área administrativa permite ao dono do site gerenciar tudo isso com login exclusivo.

> Projeto acadêmico desenvolvido por **Arthur Alexandre Ferraz Carvalho**, com layout inspirado no [casamentos.com.br](https://www.casamentos.com.br/).

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração do banco de dados](#-configuração-do-banco-de-dados)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Como executar](#-como-executar)
- [Rotas da API](#-rotas-da-api)
- [Deploy (Railway)](#-deploy-railway)
- [Licença](#-licença)

---

## ✨ Funcionalidades

**Área pública**
- Página inicial com slogan, carrossel de imagens e casamentos em destaque
- Listagem de todos os casamentos, com busca e ordenação (por data ou nome dos noivos)
- Página de detalhes de cada casamento, com cardápio separado em abas de comidas e bebidas
- Layout 100% responsivo (funciona em computador e celular)

**Área administrativa** (login exclusivo, sem cadastro público)
- Autenticação por usuário e senha (JWT)
- CRUD completo de casamentos: cadastrar, listar, editar, pesquisar e excluir
- CRUD completo de itens do cardápio (comida/bebida), sempre vinculados a um casamento
- Validação de campos obrigatórios em todos os formulários
- Mensagens de sucesso e erro em cada ação

---

## 🛠 Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Front-end | HTML5, CSS3, JavaScript (puro, sem frameworks) |
| Back-end | Node.js, Express |
| Banco de dados | MySQL |
| Autenticação | JWT (`jsonwebtoken`) + hash de senha (`crypto`/scrypt) |
| Hospedagem | Railway (backend + banco de dados MySQL) |

---

## 📁 Estrutura do projeto

```
casamento2/
├── backend/
│   ├── config/
│   │   └── db.js              # pool de conexão com o MySQL
│   ├── db/
│   │   └── schema.sql         # criação das tabelas + dados de teste
│   ├── middleware/
│   │   └── auth.js            # protege rotas que exigem login
│   ├── routes/
│   │   ├── auth.js            # login do administrador
│   │   ├── casamentos.js      # CRUD de casamentos
│   │   └── itens.js           # CRUD de comidas/bebidas
│   ├── .env.example           # modelo das variáveis de ambiente
│   ├── .env                   # variáveis reais (NUNCA sobe pro Git)
│   ├── package.json
│   └── server.js              # ponto de entrada do backend
│
└── public/
    ├── index.html              # página inicial
    ├── casamentos.html         # listagem de casamentos
    ├── casamento-detalhes.html # detalhes de um casamento
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js               # camada única de acesso à API (fetch)
    │   ├── layout.js            # header/footer compartilhados
    │   ├── main.js              # lógica da página inicial
    │   ├── casamentos.js        # lógica da listagem
    │   └── detalhes.js          # lógica da página de detalhes
    └── admin/
        ├── login.html
        ├── casamentos.html      # painel de gestão de casamentos
        ├── cardapio.html        # painel de gestão do cardápio
        └── js/
            ├── admin-layout.js
            ├── admin-auth.js
            ├── admin-casamentos.js
            └── admin-cardapio.js
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Um servidor MySQL (local ou em nuvem, como o [Railway](https://railway.com/))
- Git

---

## 🚀 Instalação

```bash
# 1. Clone o repositório
git clone <link-do-repositorio-github>
cd casamento2

# 2. Instale as dependências do backend
cd backend
npm install

# 3. Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env
# depois preencha o .env com seus dados (veja a seção abaixo)
```

O frontend (pasta `public/`) não precisa de instalação — é HTML, CSS e JS puros.

---

## 🗄 Configuração do banco de dados

1. Crie um banco MySQL (local ou no Railway).
2. Execute o script `backend/db/schema.sql` nesse banco — ele cria as tabelas `casamentos` e `itens` (com chave estrangeira entre elas) e já insere 6 casamentos e 14 itens de teste.
3. No Railway, isso pode ser feito colando o conteúdo do `schema.sql` na aba **Data → Query** do serviço MySQL.

**Modelo das tabelas:**

```
casamentos (id, noivo, noiva, data, horario, local, cidade, foto, descricao, criado_em)
itens      (id, casamento_id → FK, nome, tipo [comida|bebida], preco, criado_em)
```

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` dentro de `backend/` com base no `.env.example`:

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o backend roda (padrão `3000`) |
| `DB_HOST` | Endereço do servidor MySQL |
| `DB_PORT` | Porta do MySQL (padrão `3306`) |
| `DB_USER` | Usuário do banco de dados |
| `DB_PASSWORD` | Senha do banco de dados |
| `DB_NAME` | Nome do banco de dados (ex.: `railway`) |
| `ADMIN_USER` | Usuário de acesso ao painel administrativo |
| `ADMIN_PASSWORD_SALT` | Salt usado no hash da senha do admin |
| `ADMIN_PASSWORD_HASH` | Hash da senha do admin |
| `JWT_SECRET` | Chave usada para assinar o token de login |
| `FRONTEND_URL` | Endereço do frontend (liberado no CORS) |

> ⚠️ O `.env` nunca deve ser commitado — ele já está listado no `.gitignore`. Só o `.env.example` (sem valores reais) vai para o repositório.

---

## ▶️ Como executar

**Backend**
```bash
cd backend
npm start        # produção
npm run dev       # desenvolvimento (reinicia sozinho ao salvar)
```
O servidor sobe em `http://localhost:3000`.

**Frontend**

Abra `public/index.html` diretamente no navegador, ou publique a pasta `public/` em qualquer servidor de arquivos estático. O arquivo `js/api.js` já detecta automaticamente se está em `localhost` ou em produção e ajusta a URL da API.

**Acesso administrativo**

Acesse `public/admin/login.html` e entre com o usuário/senha configurados em `ADMIN_USER` / `ADMIN_PASSWORD_HASH`.

---

## 🔌 Rotas da API

Base: `/api`

| Método | Rota | Protegida | Descrição |
|---|---|:---:|---|
| POST | `/login` | — | Autentica o administrador e retorna um token JWT |
| GET | `/casamentos` | não | Lista todos os casamentos |
| GET | `/casamentos/:id` | não | Busca um casamento pelo id |
| POST | `/casamentos` | ✅ | Cadastra um novo casamento |
| PUT | `/casamentos/:id` | ✅ | Atualiza um casamento |
| DELETE | `/casamentos/:id` | ✅ | Remove um casamento (e seus itens, em cascata) |
| GET | `/itens?casamento_id=` | não | Lista itens do cardápio (opcionalmente filtrando por casamento) |
| POST | `/itens` | ✅ | Cadastra um item do cardápio |
| PUT | `/itens/:id` | ✅ | Atualiza um item |
| DELETE | `/itens/:id` | ✅ | Remove um item |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`, obtido no login.

---

## ☁️ Deploy (Railway)

- **Backend** e **MySQL** publicados como serviços separados no Railway.
- As mesmas variáveis do `.env` são cadastradas na aba **Variables** do serviço do backend.
- O frontend aponta para a URL pública do backend através da constante `API_BASE_URL`, em `public/js/api.js`.

---

## 📄 Licença

Projeto acadêmico, sem fins comerciais.
