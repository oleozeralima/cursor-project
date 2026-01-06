let QUESTIONS_PER_PAGE = 1;
let TOTAL_QUESTIONS = 0;
let currentPage = 0;
let answers = [];
let autoAdvanceTimeout = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (typeof questions === 'undefined' || !questions || questions.length === 0) {
        console.error('Questions not loaded! Make sure questions.js is loaded before script.js');
        alert('Erro ao carregar as perguntas. Por favor, recarregue a página.');
        return;
    }

    TOTAL_QUESTIONS = questions.length;
    answers = new Array(TOTAL_QUESTIONS).fill(null);

    initQuestions();
    updateProgress();
    setupNavigation();
    setupCloseButton();
    await loadSavedAnswers();
});

function initQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) {
        console.error('Questions container not found!');
        return;
    }

    container.innerHTML = '';

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const question = questions[i];
        const questionCard = createQuestionCard(question, i);
        container.appendChild(questionCard);
        setupSlider(i);
    }

    showQuestionPage(0);
}

function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.questionIndex = index;

    card.innerHTML = `
        <div class="question-header">
            <h2 class="question-number">${question.id}</h2>
            <div class="question-trait">
                ${question.question}
            </div>
        </div>
        <div class="question-content">
            <div class="statement-wrapper left">
                <span class="trait-label left-label">${question.leftLabel}</span>
                <p class="statement">${question.left}</p>
            </div>
            <div class="slider-container">
                <div class="slider-labels" id="labels-${index}">
                    ${[-3, -2, -1, 0, 1, 2, 3].map(val =>
                        `<span class="slider-label" data-value="${val}">${val}</span>`
                    ).join('')}
                </div>
                <div class="slider-track" id="track-${index}">
                    <div class="slider-notches">
                        ${[-3, -2, -1, 0, 1, 2, 3].map(val =>
                            `<div class="slider-notch" data-value="${val}"></div>`
                        ).join('')}
                    </div>
                    <div class="slider-fill" id="fill-${index}"></div>
                    <div class="slider-thumb" id="thumb-${index}"></div>
                </div>
            </div>
            <div class="statement-wrapper right">
                <span class="trait-label right-label">${question.rightLabel}</span>
                <p class="statement">${question.right}</p>
            </div>
        </div>
    `;

    return card;
}

function setupSlider(index) {
    const track = document.getElementById(`track-${index}`);
    const thumb = document.getElementById(`thumb-${index}`);
    const fill = document.getElementById(`fill-${index}`);
    const labels = document.getElementById(`labels-${index}`).querySelectorAll('.slider-label');
    const notches = track.querySelectorAll('.slider-notch');

    let isDragging = false;

    thumb.style.left = '50%';
    fill.style.left = '50%';
    fill.style.width = '0%';

    function positionToValue(x) {
        const rect = track.getBoundingClientRect();
        const percentage = ((x - rect.left) / rect.width) * 100;
        const notchPositions = [8.33, 25, 41.66, 58.33, 75, 91.66];
        const notchValues = [-3, -2, -1, 1, 2, 3];
        let minDistance = Infinity;
        let nearestValue = -1;

        for (let i = 0; i < notchPositions.length; i++) {
            const distance = Math.abs(percentage - notchPositions[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestValue = notchValues[i];
            }
        }

        return nearestValue;
    }

    function valueToPosition(value) {
        const positions = {
            '-3': 8.33,
            '-2': 25,
            '-1': 41.66,
            '0': 50,
            '1': 58.33,
            '2': 75,
            '3': 91.66
        };
        return positions[value.toString()] || 50;
    }

    function updateSlider(value) {
        const position = valueToPosition(value);
        thumb.style.left = `${position}%`;
        fill.style.left = '50%';
        fill.style.width = `${Math.abs(position - 50)}%`;
        if (value < 0) {
            fill.style.left = `${position}%`;
            fill.style.width = `${50 - position}%`;
        }
    }

    function setValue(value, isAutoAdvance = true) {
        if (value === 0) {
            answers[index] = null;
            thumb.style.left = '50%';
            fill.style.left = '50%';
            fill.style.width = '0%';
        } else {
            const wasUnanswered = answers[index] === null || answers[index] === undefined || answers[index] === 0;
            answers[index] = value;
            updateSlider(value);

            if (isAutoAdvance && wasUnanswered) {
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                }
                autoAdvanceTimeout = setTimeout(() => {
                    autoAdvanceToNext();
                }, 500);
            }
        }
        updateNextButtonState();
        saveAnswers();
    }
    thumb.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            setValue(positionToValue(e.clientX), false);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            const currentAnswer = answers[index];
            if (currentAnswer !== null && currentAnswer !== undefined && currentAnswer !== 0) {
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                }
                autoAdvanceTimeout = setTimeout(() => {
                    autoAdvanceToNext();
                }, 500);
            }
        }
        isDragging = false;
    });

    thumb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            setValue(positionToValue(e.touches[0].clientX), false);
        }
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            const currentAnswer = answers[index];
            if (currentAnswer !== null && currentAnswer !== undefined && currentAnswer !== 0) {
                if (autoAdvanceTimeout) {
                    clearTimeout(autoAdvanceTimeout);
                }
                autoAdvanceTimeout = setTimeout(() => {
                    autoAdvanceToNext();
                }, 500);
            }
        }
        isDragging = false;
    });

    notches.forEach(notch => {
        const value = parseInt(notch.dataset.value);
        if (value === 0) {
            notch.classList.add('disabled');
            notch.style.cursor = 'not-allowed';
            notch.style.opacity = '0.3';
        } else {
            notch.addEventListener('click', (e) => {
                e.stopPropagation();
                setValue(value);
            });
        }
    });

}

function showQuestionPage(pageIndex) {
    const cards = document.querySelectorAll('.question-card');

    if (cards.length === 0) {
        console.error('No question cards found!');
        return;
    }

    if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
        autoAdvanceTimeout = null;
    }

    cards.forEach((card) => {
        card.classList.remove('active');
    });

    if (pageIndex >= 0 && pageIndex < cards.length) {
        cards[pageIndex].classList.add('active');
        setTimeout(() => {
            cards[pageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    currentPage = pageIndex;
    updateProgress();
    updateNavigationButtons();
    updateNextButtonState();
}

function updateProgress() {
    const answeredCount = answers.filter(a => a !== null && a !== undefined && a !== 0).length;
    const percentage = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${percentage}%`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.style.display = currentPage === 0 ? 'none' : 'block';

    const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
    if (currentPage === totalPages - 1) {
        nextBtn.textContent = 'Ver Resultados →';
        nextBtn.style.display = 'block';
    } else {
        nextBtn.textContent = 'Próximo →';
        nextBtn.style.display = 'none';
    }
}

function updateNextButtonState() {
    const nextBtn = document.getElementById('nextBtn');
    const answer = answers[currentPage];
    const isAnswered = answer !== null && answer !== undefined && answer !== 0;
    nextBtn.disabled = !isAnswered;
}

function autoAdvanceToNext() {
    const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
    if (currentPage < totalPages - 1) {
        showQuestionPage(currentPage + 1);
    } else {
        if (validateAllQuestionsAnswered()) {
            handleFinishQuiz();
        }
    }
}

async function handleFinishQuiz() {
    let currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');

    if (!currentUser.id && typeof checkSupabaseAvailable === 'function' && checkSupabaseAvailable()) {
        try {
            const client = window.supabaseClient;
            if (client && currentUser.username && currentUser.phone) {
                const { data: existingUser } = await client
                    .from('users')
                    .select('*')
                    .ilike('username', currentUser.username)
                    .eq('phone', currentUser.phone)
                    .single();

                if (existingUser) {
                    currentUser = {
                        id: existingUser.id,
                        username: existingUser.username,
                        phone: existingUser.phone,
                        phoneFormatted: existingUser.phone_formatted || existingUser.phoneFormatted,
                        createdAt: existingUser.created_at || existingUser.createdAt
                    };
                    localStorage.setItem('hypeCurrentUser', JSON.stringify(currentUser));
                } else if (typeof saveUser === 'function') {
                    const savedUser = await saveUser({
                        username: currentUser.username,
                        phone: currentUser.phone,
                        phoneFormatted: currentUser.phoneFormatted
                    });
                    if (savedUser && savedUser.id) {
                        currentUser = savedUser;
                        localStorage.setItem('hypeCurrentUser', JSON.stringify(currentUser));
                    }
                }
            }
        } catch (error) {
            // Continue with localStorage user
        }
    }

    await saveAnswers();
    window.location.href = 'results.html';
}

function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            showQuestionPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', async () => {
        if (currentPage === TOTAL_QUESTIONS - 1) {
            if (validateAllQuestionsAnswered()) {
                await handleFinishQuiz();
            } else {
                const firstUnanswered = findFirstUnansweredQuestion();
                if (firstUnanswered !== -1) {
                    showQuestionPage(firstUnanswered);
                    alert('Por favor, responda todas as perguntas antes de ver os resultados.');
                }
            }
        } else {
            showQuestionPage(currentPage + 1);
        }
    });
}

function setupCloseButton() {
    const closeBtn = document.getElementById('closeBtn');
    closeBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair? Seu progresso será salvo.')) {
            window.location.href = 'index.html';
        }
    });
}

function validateAllQuestionsAnswered() {
    if (answers.length !== TOTAL_QUESTIONS) {
        return false;
    }
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const answer = answers[i];
        if (answer === null || answer === undefined || answer === 0) {
            return false;
        }
    }
    return true;
}

function findFirstUnansweredQuestion() {
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const answer = answers[i];
        if (answer === null || answer === undefined || answer === 0) {
            return i;
        }
    }
    return -1;
}

async function saveAnswers() {
    if (typeof saveAnswersToSupabase === 'function') {
        try {
            await saveAnswersToSupabase(answers);
        } catch (error) {
            console.error('Erro ao salvar no Supabase, usando localStorage:', error);
            localStorage.setItem('hypeAnswers', JSON.stringify(answers));
        }
    } else {
        localStorage.setItem('hypeAnswers', JSON.stringify(answers));
    }
}

async function loadSavedAnswers() {
    let loadedAnswers = null;

    if (typeof loadAnswersFromSupabase === 'function') {
        loadedAnswers = await loadAnswersFromSupabase(TOTAL_QUESTIONS);
    }

    if (!loadedAnswers) {
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.length === TOTAL_QUESTIONS) {
                    loadedAnswers = parsed;
                }
            } catch (error) {
                console.error('Erro ao parsear respostas do localStorage:', error);
            }
        }
    }

    if (loadedAnswers && loadedAnswers.length === TOTAL_QUESTIONS) {
        answers = loadedAnswers.map(value => (value === 0 ? null : value));

        answers.forEach((value, index) => {
            if (value !== null && value !== 0) {
                const track = document.getElementById(`track-${index}`);
                if (track) {
                    const thumb = document.getElementById(`thumb-${index}`);
                    const fill = document.getElementById(`fill-${index}`);
                    const positions = {
                        '-3': 8.33, '-2': 25, '-1': 41.66,
                        '1': 58.33, '2': 75, '3': 91.66
                    };
                    const position = positions[value.toString()] || 50;
                    thumb.style.left = `${position}%`;
                    fill.style.left = '50%';
                    fill.style.width = `${Math.abs(position - 50)}%`;
                    if (value < 0) {
                        fill.style.left = `${position}%`;
                        fill.style.width = `${50 - position}%`;
                    }
                }
            }
        });
        updateProgress();
        updateNextButtonState();
    }
}
