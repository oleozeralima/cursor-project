# 🎯 HYPE™ - Análise de Personalidade Profissional

Aplicação web moderna para análise de personalidade profissional baseada no modelo **BIG 5**, com visualização interativa em mandala e recomendações de perfil profissional.

![HYPE](https://img.shields.io/badge/HYPE-Professional-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black)

---

## ✨ Funcionalidades

- 📊 **Análise BIG 5**: Avaliação completa de 5 dimensões de personalidade
- 🎨 **Mandala Interativa**: Visualização única dos resultados em formato circular
- 👥 **Compatibilidade de Equipe**: Análise de compatibilidade com perfis profissionais
- 💼 **Recomendações de Perfil**: Sugestões de cargos ideais baseadas no perfil
- 📄 **Exportação HTML**: Geração de relatório completo com mandala incluída
- 💾 **Salvamento Automático**: Respostas salvas automaticamente (localStorage + Supabase)
- 🔄 **Sincronização**: Dados sincronizados entre dispositivos via Supabase

---

## 🚀 Início Rápido

### Pré-requisitos

- Conta no [Supabase](https://app.supabase.com) (gratuita)
- Conta no [GitHub](https://github.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU-USUARIO/hype-quiz.git
   cd hype-quiz
   ```

2. **Configure o Supabase**
   - Crie um projeto em [Supabase](https://app.supabase.com)
   - Copie a URL e a chave anon (Settings → API)
   - Edite `supabase-config.js` e cole suas credenciais

3. **Configure o Banco de Dados**
   - No Supabase, vá em **SQL Editor**
   - Execute o script `supabase-setup.sql`
   - Verifique se 3 tabelas foram criadas

4. **Teste Localmente**
   - Abra `index.html` no navegador
   - Crie uma conta e teste o quiz

📖 **Para um guia completo passo a passo, veja: [GUIA-DEPLOY.md](./GUIA-DEPLOY.md)**

---

## 📁 Estrutura do Projeto

```
hype-quiz/
├── 📄 index.html              # Página inicial
├── 🔐 login.html              # Login/Registro (inicia em cadastro)
├── ❓ quiz.html               # Questionário (30 perguntas)
├── 📊 results.html            # Resultados e exportação
│
├── 🎨 styles.css              # Estilos globais
├── 📝 questions.js            # Banco de perguntas (30 questões BIG 5)
├── 🎮 script.js               # Lógica do quiz e navegação
├── 📈 results.js              # Cálculo de resultados e exportação HTML
│
├── 🔧 supabase-config.js      # Configuração do Supabase
├── 👤 supabase-auth.js        # Autenticação e gerenciamento de usuários
├── 💾 supabase-quiz.js        # Salvamento de respostas do quiz
│
├── 🗄️ supabase-setup.sql      # Script SQL (criar tabelas)
├── 🧹 supabase-cleanup.sql     # Script SQL (limpar banco)
│
├── ⚙️ vercel.json             # Configuração do Vercel
├── 🎨 favicon.svg             # Ícone do site
│
└── 📚 Documentação
    ├── README.md              # Este arquivo
    └── GUIA-DEPLOY.md         # Guia completo de deploy
```

---

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla - sem frameworks)
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL + APIs)
- **Deploy**: [Vercel](https://vercel.com)
- **Armazenamento**: LocalStorage (fallback) + Supabase (principal)

---

## 📊 Modelo BIG 5

O questionário avalia **5 dimensões** de personalidade com **30 perguntas**:

| Dimensão | Questões | Descrição |
|----------|----------|-----------|
| **Abertura** (Openness) | 8 | Criatividade, curiosidade, abertura a novas experiências |
| **Conscienciosidade** (Conscientiousness) | 7 | Organização, disciplina, responsabilidade |
| **Extroversão** (Extraversion) | 7 | Sociabilidade, assertividade, energia |
| **Amabilidade** (Agreeableness) | 5 | Cooperação, empatia, confiança |
| **Estabilidade Emocional** (Emotional Stability) | 3 | Calma, resiliência, controle emocional |

---

## 💾 Armazenamento de Dados

### LocalStorage (Cache do Navegador)
- **Chave**: `hypeAnswers`
- **Quando**: Sempre (backup automático)
- **Persistência**: Até limpar cache do navegador

### Supabase (Banco de Dados)
- **Tabela**: `quiz_responses`
- **Quando**: Se Supabase estiver disponível
- **Persistência**: Permanente (sincroniza entre dispositivos)

**Sistema de Fallback**: Se o Supabase falhar, os dados continuam salvos no localStorage.

---

## 🎯 Funcionalidades Detalhadas

### 1. Questionário Interativo
- 30 perguntas divididas em páginas
- Slider visual para respostas (-3 a +3)
- Salvamento automático a cada resposta
- Barra de progresso

### 2. Visualização de Resultados
- **Mandala BIG 5**: Visualização circular interativa
- **Análise Detalhada**: Barras de progresso por traço
- **Compatibilidade**: Análise com 5 perfis de equipe
- **Recomendações**: Sugestões de cargos ideais

### 3. Exportação
- Geração de arquivo HTML completo
- Mandala incluída como imagem
- Design responsivo e profissional
- Fundo preto com texto branco

---

## 🔒 Segurança

- ✅ Chaves **anon** (públicas) - seguras para exposição
- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Validação de dados no frontend
- ✅ Fallback para localStorage se Supabase falhar

---

## 📖 Documentação

- **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)**: Guia completo passo a passo para deploy
- **README.md**: Este arquivo (visão geral do projeto)

---

## ⚠️ Solução de Problemas

### Supabase não inicializa
- Verifique as credenciais em `supabase-config.js`
- Abra o Console (F12) e veja os erros
- Certifique-se de que o projeto não está pausado

### Dados não aparecem
- Execute o script `supabase-setup.sql` no Supabase
- Verifique o console do navegador
- O projeto usa localStorage como fallback

### Erro ao exportar
- Verifique se completou o questionário
- Abra o Console (F12) para ver erros
- Certifique-se de que a mandala foi renderizada

---

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel:

1. Faça push para o GitHub
2. Conecte o repositório no Vercel
3. Deploy automático a cada push

Veja o guia completo: **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)**

---

## 📝 Licença

Este projeto é de código aberto. Sinta-se livre para usar e modificar.

---

## 👨‍💻 Desenvolvido com

- ❤️ JavaScript puro (sem frameworks)
- 🎨 CSS moderno com variáveis
- 🗄️ Supabase para backend
- 🚀 Vercel para hospedagem

---

**HYPE™ - Descubra seu perfil profissional!**
