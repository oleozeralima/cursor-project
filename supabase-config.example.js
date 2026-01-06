// Supabase Configuration - EXEMPLO
// Copie este arquivo para supabase-config.js e preencha com suas credenciais

const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA-CHAVE-ANON-AQUI';

let supabaseClient = null;

// Initialize Supabase when library is loaded
function initSupabase() {
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        return false;
    }
    
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = supabaseClient;
            return true;
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            return false;
        }
    }
    return false;
}

function isSupabaseAvailable() {
    const client = window.supabaseClient || supabaseClient;
    return client !== null && typeof client !== 'undefined' && typeof client.from === 'function';
}

window.isSupabaseAvailable = isSupabaseAvailable;
window.initSupabase = initSupabase;



