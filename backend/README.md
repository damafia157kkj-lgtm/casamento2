# Backend — Site de Casamento

API em Node.js + Express + MySQL que alimenta o site. Login único (o dono do site), com token JWT.

## 1. Instalar

```bash
cd backend
npm install
```

## 2. Configurar o banco de dados

Crie o banco rodando o script `db/schema.sql` no seu MySQL (Workbench, DBeaver, linha de comando etc.):

```bash
mysql -u root -p < db/schema.sql
```

Isso cria o banco `site_casamento`, as tabelas `casamentos` e `itens` (com chave estrangeira) e já insere registros de teste.

## 3. Configurar as variáveis de ambiente

O arquivo `.env` já vem preenchido com o login **arthur** e a senha que você pediu (guardada como hash, nunca em texto puro). Você só precisa ajustar os dados do banco:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=site_casamento
```

**Importante:** o arquivo `.env` está no `.gitignore` — ele não vai para o GitHub. Isso é proposital: sua senha de login não deve aparecer em texto puro em um repositório público. Se quiser trocar a senha, veja o passo 5.

## 4. Rodar localmente

```bash
npm start
```

A API sobe em `http://localhost:3000`. Teste no navegador: `http://localhost:3000` deve responder `{"mensagem":"API do Site de Casamento no ar!"}`.

No `frontend/js/api.js`, o `API_BASE_URL` já aponta para `http://localhost:3000/api` — é só abrir o site normalmente.

## 5. Trocar a senha de login (se quiser)

Rode este comando (troque `SUA_NOVA_SENHA`):

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');const h=c.scryptSync('SUA_NOVA_SENHA',s,64).toString('hex');console.log('ADMIN_PASSWORD_SALT='+s);console.log('ADMIN_PASSWORD_HASH='+h);"
```

Copie as duas linhas geradas para o `.env` (e para as variáveis no Railway, se já estiver publicado).

## 6. Publicar no Railway

1. Crie uma conta em railway.app e um novo projeto.
2. **Adicionar o banco:** "New" → "Database" → "MySQL". O Railway cria o banco e mostra host, porta, usuário, senha em "Variables".
3. **Importar o schema:** copie os dados de conexão do MySQL do Railway e rode `mysql -h HOST -P PORTA -u USUARIO -p NOME_DO_BANCO < db/schema.sql` a partir do seu computador (ou use o botão "Query" do próprio Railway e cole o conteúdo de `db/schema.sql`).
4. **Adicionar o backend:** "New" → "GitHub Repo" → selecione o repositório do backend (ou "Empty Service" + deploy manual).
5. Em "Variables" do serviço do backend, cadastre as mesmas chaves do seu `.env` (PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, ADMIN_USER, ADMIN_PASSWORD_SALT, ADMIN_PASSWORD_HASH, JWT_SECRET, FRONTEND_URL) — use os valores de conexão do MySQL que o Railway gerou no passo 2.
6. O Railway detecta o `package.json` e roda `npm install` + `npm start` sozinho.
7. Depois de publicado, copie a URL pública do serviço (algo como `https://seu-backend.up.railway.app`) e troque no `frontend/js/api.js`:
   ```js
   const API_BASE_URL = "https://seu-backend.up.railway.app/api";
   ```
8. Publique o `frontend` separadamente (Vercel, Netlify ou GitHub Pages funcionam bem para arquivos estáticos).

## Rotas da API

| Método | Rota                  | Protegida? | Descrição                        |
|--------|-----------------------|:----------:|-----------------------------------|
| POST   | /api/login             | não        | Login do administrador            |
| GET    | /api/casamentos        | não        | Lista todos os casamentos         |
| GET    | /api/casamentos/:id    | não        | Detalhes de um casamento          |
| POST   | /api/casamentos        | sim        | Cadastra um casamento             |
| PUT    | /api/casamentos/:id    | sim        | Atualiza um casamento             |
| DELETE | /api/casamentos/:id    | sim        | Exclui um casamento               |
| GET    | /api/itens              | não        | Lista itens (aceita ?casamento_id=)|
| POST   | /api/itens              | sim        | Cadastra comida/bebida            |
| PUT    | /api/itens/:id          | sim        | Atualiza comida/bebida            |
| DELETE | /api/itens/:id          | sim        | Exclui comida/bebida              |
