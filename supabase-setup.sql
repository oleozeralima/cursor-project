-- =====================================================
-- SETUP COMPLETO DO SUPABASE - QUIZ HYPE
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script é idempotente - pode ser executado múltiplas vezes
-- =====================================================

-- ========================================
-- PASSO 1: CRIAR TABELAS PRIMEIRO
-- ========================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    phone_formatted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de respostas do quiz
CREATE TABLE IF NOT EXISTS public.quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    answer INTEGER NOT NULL CHECK (answer IN (-3, -2, -1, 1, 2, 3)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Tabela de sessões de quiz (resultados completos)
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answers JSONB,
    big5_scores JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PASSO 2: CRIAR ÍNDICES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON public.quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question_id ON public.quiz_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);

-- ========================================
-- PASSO 3: CRIAR FUNÇÃO E TRIGGERS
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover triggers antigos se existirem (seguro mesmo se não existirem)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_quiz_responses_updated_at ON public.quiz_responses;

-- Criar triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_responses_updated_at
    BEFORE UPDATE ON public.quiz_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- PASSO 4: HABILITAR RLS E CRIAR POLICIES
-- ========================================

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem (seguro mesmo se não existirem)
DROP POLICY IF EXISTS "Anyone can read users" ON public.users;
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
DROP POLICY IF EXISTS "Anyone can update users" ON public.users;
DROP POLICY IF EXISTS "Anyone can delete users" ON public.users;

DROP POLICY IF EXISTS "Anyone can read responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Anyone can insert responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Anyone can update responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Anyone can delete responses" ON public.quiz_responses;

DROP POLICY IF EXISTS "Anyone can read sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Anyone can insert sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.quiz_sessions;
DROP POLICY IF EXISTS "Anyone can delete sessions" ON public.quiz_sessions;

-- Policies para tabela USERS
CREATE POLICY "Anyone can read users"
    ON public.users FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert users"
    ON public.users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update users"
    ON public.users FOR UPDATE
    USING (true);

CREATE POLICY "Anyone can delete users"
    ON public.users FOR DELETE
    USING (true);

-- Policies para tabela QUIZ_RESPONSES
CREATE POLICY "Anyone can read responses"
    ON public.quiz_responses FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert responses"
    ON public.quiz_responses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update responses"
    ON public.quiz_responses FOR UPDATE
    USING (true);

CREATE POLICY "Anyone can delete responses"
    ON public.quiz_responses FOR DELETE
    USING (true);

-- Policies para tabela QUIZ_SESSIONS
CREATE POLICY "Anyone can read sessions"
    ON public.quiz_sessions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert sessions"
    ON public.quiz_sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
    ON public.quiz_sessions FOR UPDATE
    USING (true);

CREATE POLICY "Anyone can delete sessions"
    ON public.quiz_sessions FOR DELETE
    USING (true);

-- ========================================
-- SETUP COMPLETO!
-- ========================================
-- O banco de dados está pronto para uso.
-- Este script pode ser executado múltiplas vezes sem problemas.
-- ========================================
