# ✅ CHECKLIST DE DEPLOY - HYPE™

Use este checklist para acompanhar seu progresso. Marque cada item conforme você completa.

---

## 🧹 LIMPEZA (OPCIONAL - Se quiser começar do zero)

- [ ] Deletar projetos antigos no Supabase
- [ ] Deletar projetos antigos no Vercel
- [ ] Deletar repositórios antigos no GitHub (opcional)

---

## 1️⃣ SUPABASE

### Criar Projeto
- [ ] Fazer login em https://app.supabase.com
- [ ] Criar projeto novo (nome: `hype-quiz`)
- [ ] Aguardar projeto ser criado (2-3 minutos)

### Configurar Credenciais
- [ ] Ir em Settings → API
- [ ] Copiar Project URL
- [ ] Copiar anon public key
- [ ] Abrir arquivo `supabase-config.js`
- [ ] Substituir SUPABASE_URL com a URL copiada
- [ ] Substituir SUPABASE_ANON_KEY com a chave copiada
- [ ] Salvar arquivo (Ctrl+S)

### Criar Banco de Dados
- [ ] Ir em SQL Editor no Supabase
- [ ] Abrir arquivo `supabase-setup.sql` do projeto
- [ ] Copiar TODO o conteúdo
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run"
- [ ] Ver mensagem de sucesso ✅

### Verificar
- [ ] Ir em Table Editor
- [ ] Verificar se apareceram 3 tabelas:
  - [ ] `users`
  - [ ] `quiz_responses`
  - [ ] `quiz_sessions`

---

## 2️⃣ GITHUB

### Criar Repositório
- [ ] Fazer login em https://github.com
- [ ] Criar repositório novo (nome: `hype-quiz`)
- [ ] NÃO marcar nenhuma opção (README, .gitignore, license)

### Enviar Código
- [ ] Instalar GitHub Desktop (se não tiver)
- [ ] Abrir GitHub Desktop
- [ ] File → Add Local Repository
- [ ] Selecionar pasta do projeto
- [ ] Escrever mensagem: "Initial commit - projeto HYPE simplificado"
- [ ] Clicar em "Commit to main"
- [ ] Clicar em "Publish repository"
- [ ] Selecionar repositório `hype-quiz`
- [ ] Clicar em "Publish repository"

### Verificar
- [ ] Acessar repositório no GitHub
- [ ] Verificar se todos os arquivos aparecem

---

## 3️⃣ VERCEL

### Fazer Deploy
- [ ] Fazer login em https://vercel.com
- [ ] Conectar GitHub (se não estiver conectado)
- [ ] Clicar em "Add New..." → "Project"
- [ ] Importar repositório `hype-quiz`
- [ ] Verificar configurações:
  - [ ] Framework Preset: "Other"
  - [ ] Root Directory: vazio
  - [ ] Build Command: vazio
  - [ ] Output Directory: vazio
  - [ ] Install Command: vazio
- [ ] Clicar em "Deploy"
- [ ] Aguardar deploy terminar (1-2 minutos)

### Verificar
- [ ] Ver mensagem de sucesso
- [ ] Clicar no link do site
- [ ] Site abre normalmente ✅

---

## 4️⃣ TESTES

### Teste Básico
- [ ] Site abre no link do Vercel
- [ ] Página inicial aparece corretamente
- [ ] Botão "Começar Questionário" funciona

### Teste de Registro
- [ ] Clicar em "Começar Questionário"
- [ ] Criar conta nova:
  - [ ] Nome de usuário: `teste123`
  - [ ] Telefone: `11987654321`
- [ ] Clicar em "Criar Conta"
- [ ] Ser redirecionado para o quiz ✅

### Teste de Banco de Dados
- [ ] No Supabase, ir em Table Editor
- [ ] Clicar na tabela `users`
- [ ] Ver usuário criado aparecendo ✅

### Teste de Quiz
- [ ] Responder algumas perguntas
- [ ] Avançar páginas
- [ ] Voltar e verificar se respostas foram salvas
- [ ] Completar todo o quiz

### Teste de Resultados
- [ ] Ver resultados aparecerem
- [ ] Ver mandala visual
- [ ] Ver compatibilidade com equipe
- [ ] Ver recomendação de perfil

### Teste de PDF
- [ ] Clicar em "Exportar PDF"
- [ ] PDF é gerado e baixado ✅

---

## 🎉 FINALIZAÇÃO

- [ ] Todos os testes passaram
- [ ] Site está funcionando perfeitamente
- [ ] Dados estão salvando no Supabase
- [ ] Link do Vercel está funcionando

---

## 📝 NOTAS

**Link do Vercel:** _________________________________

**Link do GitHub:** _________________________________

**URL do Supabase:** _________________________________

**Data de Deploy:** _________________________________

---

**Status Final:** ⬜ Em Progresso | ⬜ Concluído | ⬜ Com Problemas

**Problemas Encontrados:**
_____________________________________________________
_____________________________________________________
_____________________________________________________

---

**Última atualização:** Dezembro 2024




