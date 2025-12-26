// Supabase integration for quiz answers
// Simplified version with localStorage fallback

// Helper functions
function checkSupabaseAvailableQuiz() {
    if (typeof window.isSupabaseAvailable === 'function') {
        return window.isSupabaseAvailable();
    }
    const client = window.supabaseClient;
    return client !== null && typeof client !== 'undefined' && typeof client.from === 'function';
}

function getSupabaseClientQuiz() {
    return window.supabaseClient || null;
}

// Save quiz answers to Supabase
async function saveAnswersToSupabase(answers) {
    // Always save to localStorage first (backup)
    localStorage.setItem('hypeAnswers', JSON.stringify(answers));
    
    if (!checkSupabaseAvailableQuiz()) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        return;
    }
    
    try {
        const client = getSupabaseClientQuiz();
        
        // Prepare responses to insert (only valid answers)
        const responses = answers
            .map((answer, index) => ({
                user_id: currentUser.id,
                question_id: index + 1,
                answer: answer
            }))
            .filter(r => r.answer !== null && r.answer !== undefined && r.answer !== 0);
        
        if (responses.length > 0) {
            // Delete existing responses for this user first
            await client
                .from('quiz_responses')
                .delete()
                .eq('user_id', currentUser.id);
            
            // Insert new responses
            const { error } = await client
                .from('quiz_responses')
                .insert(responses)
                .select();
            
            if (error) {
                throw error;
            }
        }
    } catch (error) {
        // Data already saved to localStorage as backup
    }
}

// Load quiz answers from Supabase
async function loadAnswersFromSupabase(totalQuestions) {
    if (!checkSupabaseAvailableQuiz()) {
        return loadAnswersFromLocalStorage(totalQuestions);
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        return loadAnswersFromLocalStorage(totalQuestions);
    }
    
    try {
        const client = getSupabaseClientQuiz();
        const { data, error } = await client
            .from('quiz_responses')
            .select('question_id, answer')
            .eq('user_id', currentUser.id)
            .order('question_id', { ascending: true });
        
        if (error) {
            return loadAnswersFromLocalStorage(totalQuestions);
        }
        
        if (data && data.length > 0) {
            // Convert array of responses to answer array
            const answers = new Array(totalQuestions).fill(null);
            data.forEach(response => {
                const index = response.question_id - 1;
                if (index >= 0 && index < totalQuestions) {
                    answers[index] = response.answer;
                }
            });
            
            // Also save to localStorage as backup
            localStorage.setItem('hypeAnswers', JSON.stringify(answers));
            return answers;
        }
        
        return loadAnswersFromLocalStorage(totalQuestions);
    } catch (error) {
        return loadAnswersFromLocalStorage(totalQuestions);
            }
        }
        
function loadAnswersFromLocalStorage(totalQuestions) {
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
        return null;
}

// Save quiz session (when quiz is completed)
async function saveQuizSession(answers, big5Scores) {
    if (!checkSupabaseAvailableQuiz()) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        return;
    }
    
    try {
        const client = getSupabaseClientQuiz();
        await client
            .from('quiz_sessions')
            .insert([{
                user_id: currentUser.id,
                answers: answers,
                big5_scores: big5Scores
            }])
            .select();
    } catch (error) {
        // Silent fail - session save is not critical
    }
}
