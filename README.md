# HYPE™ - Análise de Personalidade Profissional

Aplicação web para análise de personalidade profissional baseada no modelo BIG 5.

## 📖 GUIA COMPLETO DE DEPLOY

**👉 Para um guia passo a passo completo, veja: [GUIA-DEPLOY.md](./GUIA-DEPLOY.md)**

Este guia te ensina como configurar tudo no GitHub, Supabase e Vercel do zero!

## 🚀 Como Começar (Resumo Rápido)

### 1. Configurar o Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com) e crie um projeto
2. Vá em **Settings** → **API** e copie:
   - **Project URL**
   - **anon public key**
3. Edite `supabase-config.js` e cole suas credenciais

### 2. Criar o Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Abra o arquivo `supabase-setup.sql` do projeto
3. Copie TODO o conteúdo e cole no SQL Editor
4. Clique em **Run** (ou Ctrl+Enter)
5. Verifique em **Table Editor** que apareceram 3 tabelas:
   - `users`
   - `quiz_responses`
   - `quiz_sessions`

### 3. Testar

1. Abra `index.html` no navegador
2. Abra o Console (F12)
3. Você deve ver: `✅ Supabase initialized successfully`
4. Crie uma conta e teste o quiz

## 📁 Estrutura do Projeto

```
├── index.html              # Página inicial
├── login.html              # Login/Registro
├── quiz.html               # Questionário (30 perguntas)
├── results.html            # Resultados e exportação HTML
├── styles.css              # Estilos
├── script.js               # Lógica do quiz
├── questions.js            # Banco de perguntas
├── results.js              # Cálculo dos resultados
├── supabase-config.js      # Configuração do Supabase
├── supabase-auth.js        # Autenticação
├── supabase-quiz.js        # Salvamento de respostas
└── supabase-setup.sql      # Script SQL (execute no Supabase)
```

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Supabase (backend)
- Exportação HTML (com mandala incluída)

## 📊 Modelo BIG 5

O questionário avalia 5 dimensões:
- **Abertura** (Openness) - 8 questões
- **Conscienciosidade** (Conscientiousness) - 7 questões
- **Extroversão** (Extraversion) - 7 questões
- **Amabilidade** (Agreeableness) - 5 questões
- **Estabilidade Emocional** (Emotional Stability) - 3 questões

## ⚠️ Solução de Problemas

### Supabase não inicializa
- Verifique se as credenciais em `supabase-config.js` estão corretas
- Verifique o console do navegador para erros

### Dados não aparecem no Supabase
- Verifique se executou o script `supabase-setup.sql`
- Verifique o console do navegador
- O projeto usa localStorage como fallback se o Supabase falhar

### Resetar o banco de dados
Execute o script `supabase-setup.sql` novamente no SQL Editor do Supabase. Ele remove tudo e recria do zero.

## 🔒 Segurança

- As chaves usadas são **anon keys** (públicas) e são seguras para exposição
- O projeto usa Row Level Security (RLS) no Supabase
- As policies permitem todas as operações (ajuste conforme necessário para produção)

---

Desenvolvido com ❤️
