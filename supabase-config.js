const DEFAULT_SUPABASE_URL = 'https://xzhflcpkcigslycejmpq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6aGZsY3BrY2lnc2x5Y2VqbXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NTM1NDIsImV4cCI6MjA4MjMyOTU0Mn0.KlehO918tdxCJkqVlJSebC3JhP2OCr1PYevfRLqIh7c';

const SUPABASE_URL = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) 
    ? process.env.SUPABASE_URL 
    : DEFAULT_SUPABASE_URL;

const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) 
    ? process.env.SUPABASE_ANON_KEY 
    : DEFAULT_SUPABASE_ANON_KEY;



let supabaseClient = null;

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
