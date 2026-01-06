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

async function saveAnswersToSupabase(answers) {
    try {
        localStorage.setItem('hypeAnswers', JSON.stringify(answers));
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }

    if (!checkSupabaseAvailableQuiz()) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
    if (!currentUser.id) {
        return;
    }

    try {
        const client = getSupabaseClientQuiz();
        const responses = answers
            .map((answer, index) => ({
                user_id: currentUser.id,
                question_id: index + 1,
                answer: answer
            }))
            .filter(r => r.answer !== null && r.answer !== undefined && r.answer !== 0);

        if (responses.length > 0) {
            await client
                .from('quiz_responses')
                .delete()
                .eq('user_id', currentUser.id);

            const { error } = await client
                .from('quiz_responses')
                .insert(responses)
                .select();

            if (error) {
                throw error;
            }
        }
    } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
    }
}

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
            console.error('Erro ao carregar do Supabase:', error);
            return loadAnswersFromLocalStorage(totalQuestions);
        }

        if (data && data.length > 0) {
            const answers = new Array(totalQuestions).fill(null);
            data.forEach(response => {
                const index = response.question_id - 1;
                if (index >= 0 && index < totalQuestions) {
                    answers[index] = response.answer;
                }
            });

            try {
                localStorage.setItem('hypeAnswers', JSON.stringify(answers));
            } catch (error) {
                console.error('Erro ao salvar backup no localStorage:', error);
            }
            return answers;
        }

        return loadAnswersFromLocalStorage(totalQuestions);
    } catch (error) {
        console.error('Erro ao carregar do Supabase:', error);
        return loadAnswersFromLocalStorage(totalQuestions);
    }
}

function loadAnswersFromLocalStorage(totalQuestions) {
    try {
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const loadedAnswers = JSON.parse(saved);
            if (loadedAnswers.length === totalQuestions) {
                return loadedAnswers.map(value => (value === 0 ? null : value));
            }
        }
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
    }
    return null;
}

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
        console.error('Erro ao salvar sessão no Supabase:', error);
    }
}
