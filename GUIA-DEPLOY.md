# 🚀 GUIA COMPLETO DE DEPLOY - HYPE™

Este guia vai te ajudar passo a passo a colocar seu site no ar usando GitHub, Supabase e Vercel.

**⚠️ IMPORTANTE:** Se você já tem contas, pule as seções de criação de conta e vá direto para criar projetos novos.

---

## 📋 ÍNDICE

1. [Limpar Projetos Antigos (OPCIONAL)](#0-limpar-projetos-antigos-opcional)
2. [Configurar o Supabase](#1-configurar-o-supabase)
3. [Configurar o GitHub](#2-configurar-o-github)
4. [Configurar o Vercel](#3-configurar-o-vercel)
5. [Testar Tudo](#4-testar-tudo)
6. [Solução de Problemas](#5-solução-de-problemas)

---

## 0. LIMPAR PROJETOS ANTIGOS (OPCIONAL)

Se você quer começar do zero e limpar tudo que tinha antes:

### Limpar Supabase

1. Acesse: **https://app.supabase.com** e faça login
2. No dashboard, você verá seus projetos
3. Para cada projeto antigo:
   - Clique no projeto
   - Vá em **"Settings" → "General"**
   - Role até o final e clique em **"Delete Project"**
   - Confirme a exclusão
4. ✅ Agora você pode criar um projeto novo limpo

### Limpar Vercel

1. Acesse: **https://vercel.com** e faça login
2. No dashboard, você verá seus projetos
3. Para cada projeto antigo:
   - Clique no projeto
   - Vá em **"Settings" → "General"**
   - Role até o final e clique em **"Delete Project"**
   - Digite o nome do projeto para confirmar
   - Clique em **"Delete"**
4. ✅ Agora você pode criar um projeto novo limpo

### Limpar GitHub (OPCIONAL)

Se quiser deletar repositórios antigos:

1. Acesse: **https://github.com** e faça login
2. Vá no repositório que quer deletar
3. Clique em **"Settings"** (no topo do repositório)
4. Role até o final e clique em **"Delete this repository"**
5. Digite o nome do repositório para confirmar
6. Clique em **"I understand, delete this repository"**

---

## 1. CONFIGURAR O SUPABASE

### Passo 1.1: Entrar e Criar Projeto NOVO

1. Acesse: **https://app.supabase.com**
2. **Faça login** (você já tem conta)
3. Clique em **"New Project"** (ou **"Create a new project"**)
4. Preencha:
   - **Name**: `hype-quiz` (ou qualquer nome que você quiser)
   - **Database Password**: Crie uma senha forte (ANOTE ELA em algum lugar!)
   - **Region**: Escolha a mais próxima (ex: `South America`)
5. Clique em **"Create new project"**
6. ⏳ Aguarde 2-3 minutos enquanto o projeto é criado

### Passo 1.2: Copiar Credenciais

1. Quando o projeto estiver pronto, no menu lateral esquerdo, clique em **"Settings"** (ícone de engrenagem ⚙️)
2. Clique em **"API"** no submenu
3. Você verá duas informações importantes:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** key (uma chave longa começando com `eyJ...`)

4. **COPIE ESSAS DUAS INFORMAÇÕES** e guarde em um bloco de notas temporário

### Passo 1.3: Configurar o Arquivo do Projeto

1. Abra o arquivo `supabase-config.js` no seu projeto
2. Você verá algo assim:
   ```javascript
   const SUPABASE_URL = 'https://octbimodsjksutonyxlp.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

3. **SUBSTITUA** essas linhas com as suas credenciais NOVAS:
   - Cole o **Project URL** no lugar de `SUPABASE_URL`
   - Cole a **anon public key** no lugar de `SUPABASE_ANON_KEY`

4. **SALVE** o arquivo (Ctrl+S)

### Passo 1.4: Criar o Banco de Dados

**⚠️ IMPORTANTE:** Se você teve erros antes, execute primeiro o script de limpeza:

**OPÇÃO A: Se você quer limpar tudo e começar do zero**
1. No Supabase, vá em **"SQL Editor"**
2. Abra o arquivo `supabase-cleanup.sql` do seu projeto
3. **COPIE TODO O CONTEÚDO** e cole no SQL Editor
4. Clique em **"Run"** (Ctrl+Enter)
5. Aguarde a limpeza terminar

**OPÇÃO B: Executar o script de setup diretamente (recomendado)**
1. No Supabase, no menu lateral, clique em **"SQL Editor"**
2. Clique no botão **"New query"** (ou use o editor que já está aberto)
3. Abra o arquivo `supabase-setup.sql` do seu projeto
4. **COPIE TODO O CONTEÚDO** do arquivo (Ctrl+A, Ctrl+C)
5. **COLE** no SQL Editor do Supabase (Ctrl+V)
6. **VERIFIQUE** se todo o código foi colado corretamente
7. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
8. ⏳ Aguarde alguns segundos
9. Você deve ver uma mensagem de sucesso ✅ no final

**Se der erro:**
- Verifique se copiou TODO o conteúdo do arquivo
- Tente executar o `supabase-cleanup.sql` primeiro e depois o `supabase-setup.sql`
- Certifique-se de que está no projeto correto do Supabase

### Passo 1.5: Verificar se Funcionou

1. No menu lateral do Supabase, clique em **"Table Editor"**
2. Você deve ver **3 tabelas** criadas:
   - ✅ `users`
   - ✅ `quiz_responses`
   - ✅ `quiz_sessions`

Se apareceram as 3 tabelas, está tudo certo! 🎉

---

## 2. CONFIGURAR O GITHUB

### Passo 2.1: Entrar no GitHub

1. Acesse: **https://github.com**
2. **Faça login** (você já tem conta ou pode criar uma nova)

### Passo 2.2: Criar um Repositório NOVO

1. Depois de entrar no GitHub, clique no botão **"+"** no canto superior direito
2. Clique em **"New repository"**
3. Preencha:
   - **Repository name**: `hype-quiz` (ou qualquer nome)
   - **Description**: "Quiz de personalidade profissional HYPE"
   - Deixe **Público** (Public) marcado
   - **NÃO marque** "Add a README file"
   - **NÃO marque** "Add .gitignore"
   - **NÃO marque** "Choose a license"
4. Clique em **"Create repository"**

### Passo 2.3: Enviar Seu Código para o GitHub

**Opção A: Usando GitHub Desktop (MAIS FÁCIL - RECOMENDADO)**

1. Baixe e instale: **https://desktop.github.com** (se ainda não tiver)
2. Abra o GitHub Desktop
3. Clique em **"File" → "Add Local Repository"**
4. Clique em **"Choose..."** e selecione a pasta do seu projeto
5. Você verá todos os arquivos listados
6. Na parte inferior, escreva uma mensagem: `"Initial commit - projeto HYPE simplificado"`
7. Clique em **"Commit to main"**
8. Clique em **"Publish repository"**
9. Selecione o repositório que você criou (`hype-quiz`)
10. Marque **"Keep this code private"** se quiser, ou deixe desmarcado
11. Clique em **"Publish repository"**

**Opção B: Usando Git no Terminal (AVANÇADO)**

Se você tem Git instalado, abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Initial commit - projeto HYPE simplificado"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/hype-quiz.git
git push -u origin main
```

(Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub)

### Passo 2.4: Verificar

1. Acesse seu repositório no GitHub (ex: `https://github.com/SEU-USUARIO/hype-quiz`)
2. Você deve ver todos os arquivos do projeto listados
3. ✅ Se apareceram, está funcionando!

---

## 3. CONFIGURAR O VERCEL

### Passo 3.1: Entrar no Vercel

1. Acesse: **https://vercel.com**
2. **Faça login** (você já tem conta)
3. Se não estiver conectado ao GitHub, conecte:
   - Clique no seu perfil (canto superior direito)
   - Vá em **"Settings" → "Git"**
   - Conecte sua conta do GitHub se necessário

### Passo 3.2: Fazer Deploy do Projeto NOVO

1. No Vercel, clique em **"Add New..." → "Project"** (ou **"New Project"**)
2. Você verá uma lista dos seus repositórios do GitHub
3. Se não aparecer o repositório `hype-quiz`:
   - Clique em **"Import Git Repository"**
   - Procure pelo repositório `hype-quiz`
   - Clique em **"Import"**
4. Clique em **"Import"** no repositório `hype-quiz`
5. Na tela de configuração:
   - **Framework Preset**: Deixe como **"Other"** (ou selecione manualmente)
   - **Root Directory**: Deixe vazio (ou coloque `./`)
   - **Build Command**: Deixe vazio
   - **Output Directory**: Deixe vazio (ou coloque `./`)
   - **Install Command**: Deixe vazio
6. Clique em **"Deploy"**
7. ⏳ Aguarde 1-2 minutos

### Passo 3.3: Verificar o Deploy

1. Quando terminar, você verá uma mensagem de sucesso
2. Clique no link que aparece (algo como: `hype-quiz.vercel.app`)
3. Seu site deve abrir! 🎉

### Passo 3.4: Configurar Domínio Personalizado (OPCIONAL)

Se você quiser um domínio próprio:

1. No Vercel, vá no projeto → **"Settings" → "Domains"**
2. Digite seu domínio (ex: `meusite.com`)
3. Siga as instruções para configurar o DNS

---

## 4. TESTAR TUDO

### Teste 1: Site Funciona?

1. Acesse o link do Vercel (ex: `https://hype-quiz.vercel.app`)
2. O site deve abrir normalmente
3. Clique em **"Começar Questionário"**

### Teste 2: Login/Registro Funciona?

1. Tente criar uma conta nova
2. Preencha:
   - Nome de usuário (ex: `teste123`)
   - Telefone (ex: `11987654321`)
3. Clique em **"Criar Conta"**
4. Você deve ser redirecionado para o quiz

### Teste 3: Dados Estão Salvando no Supabase?

1. No Supabase, vá em **"Table Editor"**
2. Clique na tabela **"users"**
3. Você deve ver o usuário que acabou de criar! ✅

### Teste 4: Quiz Funciona?

1. Responda algumas perguntas do quiz
2. Avance algumas páginas
3. Volte e veja se suas respostas foram salvas

### Teste 5: Resultados Funcionam?

1. Complete o quiz todo
2. Veja os resultados
3. Tente exportar o PDF

---

## 5. SOLUÇÃO DE PROBLEMAS

### ❌ Problema: "Supabase não inicializa"

**Solução:**
1. Verifique se as credenciais em `supabase-config.js` estão corretas
2. Abra o Console do navegador (F12) e veja se há erros
3. Verifique se o projeto do Supabase está ativo (não pausado)
4. Certifique-se de que copiou a **anon public key** correta (não a service_role key)

### ❌ Problema: "Erro ao criar usuário" ou "relation does not exist"

**Solução:**
1. **Primeiro, execute o script de limpeza:**
   - Abra `supabase-cleanup.sql`
   - Copie e cole no SQL Editor do Supabase
   - Execute (Run)
   
2. **Depois, execute o script de setup:**
   - Abra `supabase-setup.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor do Supabase
   - Execute (Run)
   
3. **Verifique se funcionou:**
   - Vá em Table Editor
   - Deve ver 3 tabelas: `users`, `quiz_responses`, `quiz_sessions`
   
4. Se ainda der erro:
   - Verifique se copiou TODO o conteúdo do arquivo (não deixe nada faltando)
   - Certifique-se de que está no projeto correto do Supabase
   - Tente executar o script em partes (copie e execute cada seção separadamente)

### ❌ Problema: "Site não abre no Vercel"

**Solução:**
1. Verifique se o código foi enviado para o GitHub
2. No Vercel, vá em **"Deployments"** e veja se há erros
3. Clique no deploy e veja os logs de erro
4. Verifique se o arquivo `index.html` está na raiz do projeto

### ❌ Problema: "Erro 404 no Vercel"

**Solução:**
1. Verifique se o arquivo `vercel.json` está na raiz do projeto
2. Verifique se o arquivo `index.html` está na raiz do projeto
3. No Vercel, vá em **"Settings" → "General"** e verifique o **"Root Directory"** (deve estar vazio ou `./`)
4. Tente fazer um novo deploy

### ❌ Problema: "Dados não aparecem no Supabase"

**Solução:**
1. O projeto usa localStorage como fallback - verifique se há dados no localStorage
2. Abra o Console (F12) e digite: `localStorage.getItem('hypeCurrentUser')`
3. Se aparecer dados, o Supabase pode não estar conectado
4. Verifique as credenciais em `supabase-config.js`
5. Verifique se o projeto do Supabase não está pausado

### ❌ Problema: "Erro ao gerar PDF"

**Solução:**
1. Verifique se a biblioteca html2pdf está carregando
2. Abra o Console (F12) e veja se há erros
3. Tente em outro navegador
4. Verifique se o arquivo `results.html` tem o script do html2pdf

### ❌ Problema: "Vercel não encontra o repositório"

**Solução:**
1. No Vercel, vá em **"Settings" → "Git"**
2. Verifique se o GitHub está conectado
3. Clique em **"Connect Git Provider"** se necessário
4. Autorize o Vercel a acessar seus repositórios

### ❌ Problema: "Projeto antigo ainda aparece no Vercel"

**Solução:**
1. Vá no projeto antigo no Vercel
2. **"Settings" → "General" → "Delete Project"**
3. Confirme a exclusão
4. Crie um novo projeto importando o repositório do GitHub

---

## ✅ CHECKLIST FINAL

Antes de considerar tudo pronto, verifique:

- [ ] Projetos antigos deletados (se quiser começar do zero)
- [ ] Supabase: Projeto novo criado
- [ ] Supabase: Credenciais copiadas e atualizadas em `supabase-config.js`
- [ ] Supabase: Script SQL executado e 3 tabelas criadas
- [ ] GitHub: Repositório novo criado
- [ ] GitHub: Código enviado para o repositório
- [ ] Vercel: Projeto novo criado
- [ ] Vercel: Deploy feito com sucesso
- [ ] Site abre normalmente no link do Vercel
- [ ] É possível criar conta
- [ ] Dados aparecem no Supabase (Table Editor → users)
- [ ] Quiz funciona e salva respostas
- [ ] Resultados aparecem corretamente
- [ ] PDF pode ser exportado

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionar:

1. **Abra o Console do navegador** (F12) e veja os erros
2. **Verifique os logs do Vercel** (em Deployments → clique no deploy)
3. **Verifique o Supabase** (veja se há erros no SQL Editor)
4. **Verifique se as credenciais estão corretas** em `supabase-config.js`

---

## 🎉 PRONTO!

Se tudo está funcionando, seu site está no ar! 🚀

Compartilhe o link do Vercel com quem quiser testar!

---

## 📝 RESUMO RÁPIDO PARA QUEM JÁ TEM CONTAS

1. **Supabase**: Criar projeto novo → Copiar credenciais → Atualizar `supabase-config.js` → Executar SQL
2. **GitHub**: Criar repositório novo → Enviar código
3. **Vercel**: Importar repositório → Deploy

---

**Última atualização:** Dezembro 2024
