-- =====================================================
-- LIMPEZA COMPLETA DO SUPABASE - QUIZ HYPE
-- =====================================================
-- ATENÇÃO: Este script DELETA TUDO!
-- Use apenas se quiser limpar tudo e começar do zero
-- Execute este script ANTES do supabase-setup.sql
-- =====================================================

-- Remover todas as policies
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

-- Remover todos os triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_quiz_responses_updated_at ON public.quiz_responses;

-- Remover a função (se não for usada por outros triggers)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remover índices
DROP INDEX IF EXISTS idx_quiz_responses_user_id;
DROP INDEX IF EXISTS idx_quiz_responses_question_id;
DROP INDEX IF EXISTS idx_quiz_sessions_user_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_phone;

-- Remover tabelas (em ordem - primeiro as que dependem de outras)
DROP TABLE IF EXISTS public.quiz_sessions CASCADE;
DROP TABLE IF EXISTS public.quiz_responses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ========================================
-- LIMPEZA COMPLETA!
-- ========================================
-- Agora você pode executar o supabase-setup.sql
-- para recriar tudo do zero.
-- ========================================

