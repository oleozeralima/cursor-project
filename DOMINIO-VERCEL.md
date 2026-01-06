# 🌐 Configuração de Domínio Personalizado no Vercel

## ✅ Boa Notícia: Não Atrapalha Nada!

Adicionar um domínio personalizado no Vercel **NÃO quebra nenhuma funcionalidade** do seu site. O código está preparado para funcionar em qualquer domínio.

---

## ✅ O Que Já Está OK

### 1. Navegação Relativa
- Todas as navegações usam caminhos relativos (`login.html`, `quiz.html`, etc.)
- Funcionam em qualquer domínio automaticamente

### 2. Sem URLs Hardcoded
- Não há URLs absolutas no código que dependam de um domínio específico
- Tudo funciona independente do domínio

### 3. Supabase
- As URLs do Supabase são absolutas e não dependem do seu domínio
- A conexão funciona de qualquer origem

---

## ⚠️ ÚNICA Coisa a Verificar: CORS do Supabase

O Supabase pode ter restrições de CORS configuradas. Você precisa garantir que seu novo domínio está permitido.

### Como Verificar/Configurar:

1. **Acesse o painel do Supabase:**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto

2. **Vá em Settings → API:**
   - Procure por **"Allowed Origins"** ou **"CORS Settings"**

3. **Adicione seu novo domínio:**
   - Adicione: `https://seu-dominio.com`
   - Adicione também: `https://www.seu-dominio.com` (se usar www)
   - Mantenha o domínio do Vercel: `https://seu-projeto.vercel.app`

4. **Exemplo de configuração:**
   ```
   https://seu-dominio.com
   https://www.seu-dominio.com
   https://seu-projeto.vercel.app
   http://localhost:3000 (para desenvolvimento)
   ```

---

## 🔍 Como Testar se Está Funcionando

Após configurar o domínio:

1. **Teste o site no novo domínio:**
   - Acesse `https://seu-dominio.com`
   - Tente criar uma conta
   - Complete o quiz
   - Verifique se os dados são salvos

2. **Verifique o Console do Navegador (F12):**
   - Se aparecer erro de CORS, você precisa adicionar o domínio no Supabase
   - Erro típico: `"CORS policy: No 'Access-Control-Allow-Origin' header"`

3. **Teste todas as funcionalidades:**
   - ✅ Login/Registro
   - ✅ Quiz (salvamento automático)
   - ✅ Resultados
   - ✅ Exportação HTML

---

## 📋 Checklist

- [ ] Domínio configurado no Vercel
- [ ] Domínio adicionado nas configurações de CORS do Supabase
- [ ] Site acessível no novo domínio
- [ ] Login/Registro funcionando
- [ ] Quiz salvando dados corretamente
- [ ] Sem erros no console do navegador

---

## 🆘 Se Der Problema

### Erro de CORS:
- **Solução:** Adicione o domínio nas configurações do Supabase (Settings → API → Allowed Origins)

### Site não carrega:
- **Solução:** Verifique se o DNS está configurado corretamente no Vercel
- Aguarde a propagação do DNS (pode levar até 48h)

### Supabase não conecta:
- **Solução:** Verifique se as variáveis de ambiente estão configuradas no Vercel
- Verifique se o domínio está na lista de CORS do Supabase

---

## ✅ Conclusão

**Seu site vai funcionar perfeitamente com o domínio personalizado!** 

A única coisa que você precisa fazer é adicionar o novo domínio nas configurações de CORS do Supabase (se ainda não estiver configurado para aceitar qualquer origem).

---

**Última atualização:** Guia criado para configuração de domínio

