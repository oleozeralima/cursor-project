# 🚀 Guia de Deploy - HYPE™

Guia passo a passo para colocar seu site no ar usando Supabase, GitHub e Vercel.

---

## 📋 Índice

1. [Configurar Supabase](#1-configurar-supabase)
2. [Configurar GitHub](#2-configurar-github)
3. [Configurar Vercel](#3-configurar-vercel)
4. [Testar](#4-testar)
5. [Solução de Problemas](#5-solução-de-problemas)

---

## 1. Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [https://app.supabase.com](https://app.supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `hype-quiz` (ou outro nome)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: `South America`)
4. Clique em **"Create new project"**
5. ⏳ Aguarde 2-3 minutos

### 1.2 Copiar Credenciais

1. No menu lateral, clique em **"Settings"** (⚙️)
2. Clique em **"API"**
3. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

### 1.3 Atualizar Configuração

1. Abra o arquivo `supabase-config.js` no projeto
2. Substitua as credenciais:
   ```javascript
   const SUPABASE_URL = 'COLE_AQUI_A_URL';
   const SUPABASE_ANON_KEY = 'COLE_AQUI_A_CHAVE';
   ```
3. Salve o arquivo (Ctrl+S)

### 1.4 Criar Banco de Dados

1. No Supabase, vá em **"SQL Editor"**
2. Abra o arquivo `supabase-setup.sql` do projeto
3. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
4. **Cole** no SQL Editor do Supabase (Ctrl+V)
5. Clique em **"Run"** (ou Ctrl+Enter)
6. ⏳ Aguarde alguns segundos

### 1.5 Verificar

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver **3 tabelas**:
   - ✅ `users`
   - ✅ `quiz_responses`
   - ✅ `quiz_sessions`

Se apareceram as 3 tabelas, está tudo certo! 🎉

---

## 2. Configurar GitHub

### 2.1 Criar Repositório

1. Acesse [https://github.com](https://github.com) e faça login
2. Clique no botão **"+"** (canto superior direito) → **"New repository"**
3. Preencha:
   - **Repository name**: `hype-quiz` (ou outro nome)
   - **Description**: "Quiz de personalidade profissional HYPE"
   - Deixe **Público** (Public)
   - **NÃO marque** nenhuma opção (README, .gitignore, license)
4. Clique em **"Create repository"**

### 2.2 Enviar Código

**Opção A: GitHub Desktop (Recomendado)**

1. Baixe: [https://desktop.github.com](https://desktop.github.com) (se não tiver)
2. Abra o GitHub Desktop
3. **File** → **"Add Local Repository"**
4. Clique em **"Choose..."** e selecione a pasta do projeto
5. Na parte inferior, escreva: `"Initial commit - projeto HYPE"`
6. Clique em **"Commit to main"**
7. Clique em **"Publish repository"**
8. Selecione o repositório criado
9. Clique em **"Publish repository"**

**Opção B: Terminal (Avançado)**

Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Initial commit - projeto HYPE"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

⚠️ **Substitua:**
- `SEU-USUARIO` → seu usuário do GitHub
- `SEU-REPOSITORIO` → nome do repositório criado

**Se pedir autenticação:**
- GitHub não aceita mais senha
- Crie um Personal Access Token: [https://github.com/settings/tokens](https://github.com/settings/tokens)
- Use o token como senha

### 2.3 Verificar

1. Acesse seu repositório no GitHub
2. Você deve ver todos os arquivos do projeto
3. ✅ Se apareceram, está funcionando!

---

## 3. Configurar Vercel

### 3.1 Fazer Deploy

1. Acesse [https://vercel.com](https://vercel.com) e faça login
2. Se não estiver conectado ao GitHub:
   - Clique no perfil (canto superior direito)
   - **Settings** → **Git**
   - Conecte sua conta do GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório `hype-quiz` (ou o nome que você criou)
5. Se não aparecer, clique em **"Import Git Repository"** e procure
6. Clique em **"Import"**
7. Na tela de configuração:
   - **Framework Preset**: Deixe como **"Other"**
   - **Root Directory**: Deixe vazio
   - **Build Command**: Deixe vazio
   - **Output Directory**: Deixe vazio
   - **Install Command**: Deixe vazio
8. Clique em **"Deploy"**
9. ⏳ Aguarde 1-2 minutos

### 3.2 Verificar

1. Quando terminar, você verá uma mensagem de sucesso
2. Clique no link que aparece (ex: `hype-quiz.vercel.app`)
3. Seu site deve abrir! 🎉

---

## 4. Testar

### Teste 1: Site Funciona?
- Acesse o link do Vercel
- O site deve abrir normalmente
- Clique em **"Começar Questionário"**

### Teste 2: Login/Registro Funciona?
- Tente criar uma conta nova
- Preencha nome de usuário e telefone
- Clique em **"Criar Conta"**
- Você deve ser redirecionado para o quiz

### Teste 3: Dados Estão Salvando?
- No Supabase, vá em **"Table Editor"**
- Clique na tabela **"users"**
- Você deve ver o usuário criado! ✅

### Teste 4: Quiz Funciona?
- Responda algumas perguntas
- Avance algumas páginas
- Volte e veja se as respostas foram salvas

### Teste 5: Resultados Funcionam?
- Complete o quiz todo
- Veja os resultados
- Tente exportar os resultados (arquivo HTML)

---

## 5. Solução de Problemas

### ❌ "Supabase não inicializa"

**Solução:**
1. Verifique se as credenciais em `supabase-config.js` estão corretas
2. Abra o Console do navegador (F12) e veja se há erros
3. Verifique se o projeto do Supabase está ativo (não pausado)
4. Certifique-se de que copiou a **anon public key** (não a service_role key)

### ❌ "Erro ao criar usuário" ou "relation does not exist"

**Solução:**
1. No Supabase, vá em **"SQL Editor"**
2. Abra o arquivo `supabase-cleanup.sql` do projeto
3. Copie TODO o conteúdo e cole no SQL Editor
4. Clique em **"Run"**
5. Depois, abra `supabase-setup.sql`
6. Copie TODO o conteúdo e cole no SQL Editor
7. Clique em **"Run"**
8. Verifique em **"Table Editor"** que apareceram 3 tabelas

### ❌ "Site não abre no Vercel"

**Solução:**
1. Verifique se o código foi enviado para o GitHub
2. No Vercel, vá em **"Deployments"** e veja se há erros
3. Clique no deploy e veja os logs de erro
4. Verifique se o arquivo `index.html` está na raiz do projeto

### ❌ "Erro 404 no Vercel"

**Solução:**
1. Verifique se o arquivo `vercel.json` está na raiz do projeto
2. Verifique se o arquivo `index.html` está na raiz do projeto
3. No Vercel, vá em **"Settings"** → **"General"** e verifique o **"Root Directory"** (deve estar vazio)
4. Tente fazer um novo deploy

### ❌ "Dados não aparecem no Supabase"

**Solução:**
1. O projeto usa localStorage como fallback
2. Abra o Console (F12) e digite: `localStorage.getItem('hypeCurrentUser')`
3. Se aparecer dados, o Supabase pode não estar conectado
4. Verifique as credenciais em `supabase-config.js`
5. Verifique se o projeto do Supabase não está pausado

### ❌ "Erro ao exportar resultados"

**Solução:**
1. Abra o Console (F12) e veja se há erros
2. Verifique se completou o questionário antes de exportar
3. Tente em outro navegador
4. Certifique-se de que a mandala foi renderizada na tela antes de exportar

### ❌ "Vercel não encontra o repositório"

**Solução:**
1. No Vercel, vá em **"Settings"** → **"Git"**
2. Verifique se o GitHub está conectado
3. Clique em **"Connect Git Provider"** se necessário
4. Autorize o Vercel a acessar seus repositórios

### ❌ "Erro de autenticação no GitHub"

**Solução:**
1. GitHub não aceita mais senha
2. Crie um Personal Access Token: [https://github.com/settings/tokens](https://github.com/settings/tokens)
3. Clique em **"Generate new token (classic)"**
4. Marque **"repo"** (todas as opções)
5. Copie o token
6. Use o token como senha quando pedir autenticação

---

## ✅ Checklist Final

Antes de considerar tudo pronto:

- [ ] Supabase: Projeto criado
- [ ] Supabase: Credenciais atualizadas em `supabase-config.js`
- [ ] Supabase: Script SQL executado (3 tabelas criadas)
- [ ] GitHub: Repositório criado
- [ ] GitHub: Código enviado para o repositório
- [ ] Vercel: Projeto criado
- [ ] Vercel: Deploy feito com sucesso
- [ ] Site abre normalmente no link do Vercel
- [ ] É possível criar conta
- [ ] Dados aparecem no Supabase (Table Editor → users)
- [ ] Quiz funciona e salva respostas
- [ ] Resultados aparecem corretamente
- [ ] Arquivo HTML pode ser exportado (com mandala incluída)

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:

1. **Abra o Console do navegador** (F12) e veja os erros
2. **Verifique os logs do Vercel** (Deployments → clique no deploy)
3. **Verifique o Supabase** (veja se há erros no SQL Editor)
4. **Verifique se as credenciais estão corretas** em `supabase-config.js`

---

## 🎉 Pronto!

Se tudo está funcionando, seu site está no ar! 🚀

Compartilhe o link do Vercel com quem quiser testar!

---

**Última atualização:** Dezembro 2024
