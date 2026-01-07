// Quiz configuration
let QUESTIONS_PER_PAGE = 1;
let TOTAL_QUESTIONS = 0;
let currentPage = 0;
let answers = [];

// Initialize the quiz
document.addEventListener('DOMContentLoaded', async function() {
    // Ensure questions are loaded
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

    // Calculate total pages
    const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

    // Create question pages
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageStart = pageIndex * QUESTIONS_PER_PAGE;
        const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
        
        for (let i = pageStart; i < pageEnd; i++) {
            const question = questions[i];
            const questionCard = createQuestionCard(question, i);
            container.appendChild(questionCard);
            // Setup slider after card is in the DOM
            setupSlider(i);
        }
    }

    // Show first page
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
    
    // Initialize slider at center (0) but don't set as answered
    // Thumb starts visible at center position for reference
    thumb.style.left = '50%';
    fill.style.left = '50%';
    fill.style.width = '0%';

    // Position to value conversion - snaps to nearest notch (excluding 0)
    function positionToValue(x) {
        const rect = track.getBoundingClientRect();
        const percentage = ((x - rect.left) / rect.width) * 100;
        
        // Find the nearest notch position (excluding 0 - it's not a valid answer)
        const notchPositions = [8.33, 25, 41.66, 58.33, 75, 91.66];
        const notchValues = [-3, -2, -1, 1, 2, 3];
        
        let minDistance = Infinity;
        let nearestValue = -1; // Default to -1 if somehow no match found
        
        for (let i = 0; i < notchPositions.length; i++) {
            const distance = Math.abs(percentage - notchPositions[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestValue = notchValues[i];
            }
        }
        
        return nearestValue;
}

    // Value to position conversion - matches the CSS notch positions exactly
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

    // Update slider visual state
    function updateSlider(value) {
        const position = valueToPosition(value);
        thumb.style.left = `${position}%`;
        fill.style.left = '50%';
        fill.style.width = `${Math.abs(position - 50)}%`;
        if (value < 0) {
            fill.style.left = `${position}%`;
            fill.style.width = `${50 - position}%`;
        }
        
        // Update colors based on direction
        const card = document.querySelector(`[data-question-index="${index}"]`);
        const leftStatement = card?.querySelector('.statement-wrapper.left .statement');
        const rightStatement = card?.querySelector('.statement-wrapper.right .statement');
        
        if (value < 0) {
            // Left side - Orange
            fill.style.background = 'var(--accent-orange)';
            thumb.style.background = 'var(--accent-orange)';
            thumb.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            if (leftStatement) {
                leftStatement.style.color = 'var(--accent-orange)';
                leftStatement.style.fontWeight = '600';
            }
            if (rightStatement) {
                rightStatement.style.color = 'var(--text-secondary)';
                rightStatement.style.fontWeight = '400';
            }
        } else if (value > 0) {
            // Right side - Blue
            fill.style.background = 'var(--accent-blue)';
            thumb.style.background = 'var(--accent-blue)';
            thumb.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.6)';
            if (rightStatement) {
                rightStatement.style.color = 'var(--accent-blue)';
                rightStatement.style.fontWeight = '600';
            }
            if (leftStatement) {
                leftStatement.style.color = 'var(--text-secondary)';
                leftStatement.style.fontWeight = '400';
            }
        } else {
            // Center - Reset colors
            fill.style.background = 'var(--accent-orange)';
            thumb.style.background = 'var(--accent-orange)';
            thumb.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            if (leftStatement) {
                leftStatement.style.color = 'var(--text-secondary)';
                leftStatement.style.fontWeight = '400';
            }
            if (rightStatement) {
                rightStatement.style.color = 'var(--text-secondary)';
                rightStatement.style.fontWeight = '400';
            }
        }
    }

    // Set slider value (0 is not allowed)
    function setValue(value) {
        // Reject 0 as a valid answer
        if (value === 0) {
            answers[index] = null;
            thumb.style.left = '50%';
            fill.style.left = '50%';
            fill.style.width = '0%';
            // Reset colors when value is 0
            const card = document.querySelector(`[data-question-index="${index}"]`);
            const leftStatement = card?.querySelector('.statement-wrapper.left .statement');
            const rightStatement = card?.querySelector('.statement-wrapper.right .statement');
            fill.style.background = 'var(--accent-orange)';
            thumb.style.background = 'var(--accent-orange)';
            thumb.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            if (leftStatement) {
                leftStatement.style.color = 'var(--text-secondary)';
                leftStatement.style.fontWeight = '400';
            }
            if (rightStatement) {
                rightStatement.style.color = 'var(--text-secondary)';
                rightStatement.style.fontWeight = '400';
            }
        } else {
            answers[index] = value;
            updateSlider(value);
        }
        updateNextButtonState();
        saveAnswers();
        
        // Auto-advance to next question when answered
        if (value !== null && value !== 0) {
            autoAdvanceToNext(index);
        }
        }
        
    // Mouse events - only allow dragging the thumb, not clicking the track
    thumb.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            isDragging = true;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
            const value = positionToValue(e.clientX);
            setValue(value);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

    // Touch events - only allow dragging the thumb
    thumb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            const value = positionToValue(touch.clientX);
            setValue(value);
        }
    });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
    // Click on notches only - no clicking on track (0 notch is disabled)
    notches.forEach(notch => {
        const value = parseInt(notch.dataset.value);
        // Disable the 0 notch - it's not a valid answer
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

function setAnswerValue(index, value) {
    // Reject 0 as a valid answer
    if (value === 0) {
        answers[index] = null;
    } else {
        answers[index] = value;
    }
    
    // Sync with slider if it exists
    const track = document.getElementById(`track-${index}`);
    if (track) {
        const thumb = document.getElementById(`thumb-${index}`);
        const fill = document.getElementById(`fill-${index}`);
        const card = document.querySelector(`[data-question-index="${index}"]`);
        const leftStatement = card?.querySelector('.statement-wrapper.left .statement');
        const rightStatement = card?.querySelector('.statement-wrapper.right .statement');
        
        if (value !== null && value !== 0) {
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
            
            // Update colors based on direction
            if (value < 0) {
                // Left side - Orange
                fill.style.background = 'var(--accent-orange)';
                thumb.style.background = 'var(--accent-orange)';
                thumb.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
                if (leftStatement) {
                    leftStatement.style.color = 'var(--accent-orange)';
                    leftStatement.style.fontWeight = '600';
                }
                if (rightStatement) {
                    rightStatement.style.color = 'var(--text-secondary)';
                    rightStatement.style.fontWeight = '400';
                }
            } else if (value > 0) {
                // Right side - Blue
                fill.style.background = 'var(--accent-blue)';
                thumb.style.background = 'var(--accent-blue)';
                thumb.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.6)';
                if (rightStatement) {
                    rightStatement.style.color = 'var(--accent-blue)';
                    rightStatement.style.fontWeight = '600';
                }
                if (leftStatement) {
                    leftStatement.style.color = 'var(--text-secondary)';
                    leftStatement.style.fontWeight = '400';
                }
            }
        } else {
            thumb.style.left = '50%';
            fill.style.left = '50%';
            fill.style.width = '0%';
            // Reset colors
            fill.style.background = 'var(--accent-orange)';
            thumb.style.background = 'var(--accent-orange)';
            thumb.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            if (leftStatement) {
                leftStatement.style.color = 'var(--text-secondary)';
                leftStatement.style.fontWeight = '400';
            }
            if (rightStatement) {
                rightStatement.style.color = 'var(--text-secondary)';
                rightStatement.style.fontWeight = '400';
            }
        }
    }
    
    updateNextButtonState();
    saveAnswers();
    
    // Auto-advance to next question when answered
    if (value !== null && value !== 0) {
        autoAdvanceToNext(index);
    }
}

function autoAdvanceToNext(currentIndex) {
    // Wait a bit for visual feedback, then advance
    setTimeout(() => {
        // Check if there's a next question
        if (currentIndex < TOTAL_QUESTIONS - 1) {
            const nextPage = currentIndex + 1; // Since QUESTIONS_PER_PAGE = 1, page = question index
            showQuestionPage(nextPage);
        } else {
            // Last question - update navigation to show "Ver Resultados" button
            updateNavigationButtons();
            updateNextButtonState();
        }
    }, 500);
}

function showQuestionPage(pageIndex) {
    const cards = document.querySelectorAll('.question-card');
    const pageStart = pageIndex * QUESTIONS_PER_PAGE;
    const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);

    if (cards.length === 0) {
        console.error('No question cards found!');
        return;
    }
    
    cards.forEach((card, index) => {
        if (index >= pageStart && index < pageEnd) {
            card.classList.add('active');
            // Apply colors if there's already an answer
            const answer = answers[index];
            if (answer !== null && answer !== undefined && answer !== 0) {
                setAnswerValue(index, answer);
            }
        } else {
            card.classList.remove('active');
        }
    });

    currentPage = pageIndex;
    updateProgress();
    updateNavigationButtons();
    updateNextButtonState();
}

function updateProgress() {
    // Count only valid answers (not null, undefined, or 0)
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
        // Last question - show "Ver Resultados" button
        nextBtn.textContent = 'Ver Resultados →';
        nextBtn.style.display = 'block';
    } else {
        // Hide "Próximo" button until last question (auto-advance handles navigation)
        nextBtn.style.display = 'none';
    }
}

function updateNextButtonState() {
    const nextBtn = document.getElementById('nextBtn');
    const pageStart = currentPage * QUESTIONS_PER_PAGE;
    const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
    
    // Check if all questions on current page are answered (0 is not a valid answer)
    let allAnswered = true;
    for (let i = pageStart; i < pageEnd; i++) {
        const answer = answers[i];
        // Answer must exist, not be null/undefined, and not be 0
        if (answer === null || answer === undefined || answer === 0) {
            allAnswered = false;
            break;
        }
    }
    
    nextBtn.disabled = !allAnswered;
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
        const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
        
        if (currentPage < totalPages - 1) {
            showQuestionPage(currentPage + 1);
        } else {
            // Final validation: ensure ALL questions are answered before allowing results
            if (validateAllQuestionsAnswered()) {
                // Ensure user has ID before saving
                let currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
                
                if (!currentUser.id && typeof checkSupabaseAvailable === 'function' && checkSupabaseAvailable()) {
                    // Try to sync user to Supabase
                    try {
                        const client = window.supabaseClient;
                        if (client && currentUser.username && currentUser.phone) {
                            // Check if user exists in Supabase
                            const { data: existingUser, error: findError } = await client
                                .from('users')
                                .select('*')
                                .ilike('username', currentUser.username)
                                .eq('phone', currentUser.phone)
                                .single();
                            
                            if (findError && findError.code !== 'PGRST116') {
                                console.error('Error finding user:', findError);
                            }
                            
                            if (existingUser) {
                                // Update localStorage with Supabase user
                                currentUser = {
                                    id: existingUser.id,
                                    username: existingUser.username,
                                    phone: existingUser.phone,
                                    phoneFormatted: existingUser.phone_formatted || existingUser.phoneFormatted,
                                    createdAt: existingUser.created_at || existingUser.createdAt
                                };
                                localStorage.setItem('hypeCurrentUser', JSON.stringify(currentUser));
                            } else {
                                // User doesn't exist in Supabase, try to create
                                if (typeof saveUser === 'function') {
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
                        }
                    } catch (error) {
                        console.error('Error syncing user:', error);
                    }
                }
                
                await saveAnswers();
                window.location.href = 'results.html';
            } else {
                // Find and show the first unanswered question
                const firstUnanswered = findFirstUnansweredQuestion();
                if (firstUnanswered !== -1) {
                    // Navigate to the page containing the unanswered question
                    const pageWithUnanswered = Math.floor(firstUnanswered / QUESTIONS_PER_PAGE);
                    showQuestionPage(pageWithUnanswered);
                    alert('Por favor, responda todas as perguntas antes de ver os resultados.');
                }
            }
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

// Validate that ALL questions are answered (not null, undefined, or 0)
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

// Find the first unanswered question index
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
    console.log('💾 saveAnswers called, saving', answers.filter(a => a !== null && a !== undefined && a !== 0).length, 'answers');
    
    // Save to Supabase if available, otherwise localStorage
    if (typeof saveAnswersToSupabase === 'function') {
        try {
            await saveAnswersToSupabase(answers);
        } catch (error) {
            console.error('Error in saveAnswersToSupabase:', error);
            // Fallback to localStorage (already saved in saveAnswersToSupabase, but just in case)
            localStorage.setItem('hypeAnswers', JSON.stringify(answers));
        }
    } else {
        localStorage.setItem('hypeAnswers', JSON.stringify(answers));
    }
}

async function loadSavedAnswers() {
    let loadedAnswers = null;
    
    // Try to load from Supabase first, then localStorage
    if (typeof loadAnswersFromSupabase === 'function') {
        loadedAnswers = await loadAnswersFromSupabase(TOTAL_QUESTIONS);
}

    // If Supabase didn't return data, try localStorage
    if (!loadedAnswers) {
        const saved = localStorage.getItem('hypeAnswers');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length === TOTAL_QUESTIONS) {
                loadedAnswers = parsed;
            }
        }
    }
    
    if (loadedAnswers && loadedAnswers.length === TOTAL_QUESTIONS) {
        answers = loadedAnswers;
        // Reset any 0 values to null (0 is not a valid answer)
        answers = answers.map(value => (value === 0 ? null : value));
        
        // Update sliders and mobile buttons with saved values
        answers.forEach((value, index) => {
            if (value !== null && value !== 0) {
                setAnswerValue(index, value);
            }
        });
        updateProgress();
        updateNextButtonState();
    }
}
