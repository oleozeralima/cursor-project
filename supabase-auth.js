let isLoginMode = false;

function checkSupabaseAvailable() {
    if (typeof window.isSupabaseAvailable === 'function') {
        return window.isSupabaseAvailable();
    }
    const client = window.supabaseClient;
    return client !== null && typeof client !== 'undefined' && typeof client.from === 'function';
}

function getSupabaseClient() {
    return window.supabaseClient || null;
}

async function loadUsers() {
    if (checkSupabaseAvailable()) {
        try {
            const client = getSupabaseClient();
            const { data, error } = await client.from('users').select('*');

            if (error) {
                console.error('Erro ao carregar usuários do Supabase:', error);
                return loadUsersFromLocalStorage();
            }
            return data || [];
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            return loadUsersFromLocalStorage();
        }
    }
    return loadUsersFromLocalStorage();
}

function loadUsersFromLocalStorage() {
    try {
        const stored = localStorage.getItem('hypeUsers');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erro ao carregar usuários do localStorage:', error);
        return [];
    }
}

async function saveUser(user) {
    if (checkSupabaseAvailable()) {
        try {
            const client = getSupabaseClient();
            const userData = {
                username: user.username,
                phone: user.phone,
                phone_formatted: user.phoneFormatted || user.phone_formatted
            };

            const { data, error } = await client
                .from('users')
                .insert([userData])
                .select()
                .single();

            if (error) {
                // Se usuário já existe, busca usuário existente
                if (error.code === '23505') {
                    const { data: existingUser } = await client
                        .from('users')
                        .select('*')
                        .eq('username', user.username)
                        .single();

                    if (existingUser) {
                        return normalizeUser(existingUser);
                    }
                }
                console.error('Erro ao salvar usuário no Supabase:', error);
                return saveUserToLocalStorage(user);
            }

            if (data) {
                return normalizeUser(data);
            }
            return saveUserToLocalStorage(user);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            return saveUserToLocalStorage(user);
        }
    }
    return saveUserToLocalStorage(user);
}

function saveUserToLocalStorage(user) {
    try {
        let users = loadUsersFromLocalStorage();
        if (!user.id) {
            user.id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        users.push(user);
        localStorage.setItem('hypeUsers', JSON.stringify(users));
        return user;
    } catch (error) {
        console.error('Erro ao salvar usuário no localStorage:', error);
        return user;
    }
}

function normalizeUser(user) {
    if (!user) return null;
    return {
        id: user.id,
        username: user.username,
        phone: user.phone,
        phoneFormatted: user.phone_formatted || user.phoneFormatted,
        createdAt: user.created_at || user.createdAt
    };
}

function validateBrazilianPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length < 10 || digits.length > 11) {
        return { valid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
    }
    
    const areaCode = digits.substring(0, 2);
    if (parseInt(areaCode) < 11 || parseInt(areaCode) > 99) {
        return { valid: false, error: 'Código de área inválido (deve ser entre 11 e 99)' };
    }
    
    let formatted = '';
    if (digits.length === 11) {
        formatted = `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
    } else {
        formatted = `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }
    
    return { valid: true, formatted: formatted, digits: digits };
}

function formatPhoneInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
        input.value = value.length > 0 ? `(${value}` : '';
    } else if (value.length <= 7) {
        input.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length <= 11) {
        if (value.length <= 10) {
            input.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
        } else {
            input.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
        }
    } else {
        value = value.substring(0, 11);
        input.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }
}

async function usernameExists(username) {
    if (checkSupabaseAvailable()) {
        try {
            const client = getSupabaseClient();
            const { data, error } = await client
                .from('users')
                .select('id')
                .ilike('username', username);
            
            if (error) {
                const users = loadUsersFromLocalStorage();
                return users.some(user => user.username.toLowerCase() === username.toLowerCase());
            }
            return data && data.length > 0;
        } catch (error) {
            const users = loadUsersFromLocalStorage();
            return users.some(user => user.username.toLowerCase() === username.toLowerCase());
        }
    }
        const users = loadUsersFromLocalStorage();
        return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

async function phoneExists(phone) {
    if (checkSupabaseAvailable()) {
        try {
            const client = getSupabaseClient();
            const { data, error } = await client
                .from('users')
                .select('id')
                .eq('phone', phone);
            
            if (error) {
                const users = loadUsersFromLocalStorage();
                return users.some(user => user.phone === phone);
            }
            return data && data.length > 0;
        } catch (error) {
            const users = loadUsersFromLocalStorage();
            return users.some(user => user.phone === phone);
        }
    }
        const users = loadUsersFromLocalStorage();
        return users.some(user => user.phone === phone);
}

// Show/hide error messages
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        const inputId = elementId.replace('Error', '').replace('Success', '');
        const input = document.getElementById(inputId);
        if (input) input.classList.add('error');
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
        const inputId = elementId.replace('Error', '').replace('Success', '');
        const input = document.getElementById(inputId);
        if (input) input.classList.remove('error');
    }
}

function showSuccess(elementId, message) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.add('show');
        const inputId = elementId.replace('Success', '');
        const input = document.getElementById(inputId);
        if (input) input.classList.remove('error');
    }
}

function hideSuccess(elementId) {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.classList.remove('show');
    }
}

async function validateUsername(username, isLogin = false) {
    if (!username || username.trim().length === 0) {
        return { valid: false, error: 'Nome de usuário é obrigatório' };
    }
    
    if (username.trim().length < 3) {
        return { valid: false, error: 'Nome de usuário deve ter pelo menos 3 caracteres' };
    }
    
    if (username.trim().length > 20) {
        return { valid: false, error: 'Nome de usuário deve ter no máximo 20 caracteres' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
        return { valid: false, error: 'Nome de usuário pode conter apenas letras, números, _ e -' };
    }
    
        const exists = await usernameExists(username.trim());
    if (!isLogin && exists) {
        return { valid: false, error: 'Este nome de usuário já está em uso' };
        }
    if (isLogin && !exists) {
        return { valid: false, error: 'Usuário não encontrado' };
    }
    
    return { valid: true };
}

function toggleMode() {
    isLoginMode = !isLoginMode;
    
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');
    
    hideError('usernameError');
    hideError('phoneError');
    hideSuccess('usernameSuccess');
    if (usernameInput) usernameInput.classList.remove('error');
    if (phoneInput) phoneInput.classList.remove('error');
    
    if (usernameInput) usernameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    
    if (isLoginMode) {
        if (pageTitle) pageTitle.textContent = 'Login';
        if (pageSubtitle) pageSubtitle.textContent = 'Acesse sua conta para continuar';
        if (submitBtn) submitBtn.textContent = 'Entrar';
        if (toggleText) toggleText.textContent = 'Não tem uma conta?';
        if (toggleModeBtn) toggleModeBtn.textContent = 'Criar nova conta';
    } else {
        if (pageTitle) pageTitle.textContent = 'Registro';
        if (pageSubtitle) pageSubtitle.textContent = 'Crie sua conta para começar';
        if (submitBtn) submitBtn.textContent = 'Criar Conta';
        if (toggleText) toggleText.textContent = 'Já tem uma conta?';
        if (toggleModeBtn) toggleModeBtn.textContent = 'Fazer login';
    }
}

async function handleSubmit(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');
    
    if (!usernameInput || !phoneInput) {
        console.error('Form inputs not found');
        alert('Erro: Campos do formulário não encontrados. Por favor, recarregue a página.');
        return;
    }
    
    const username = usernameInput.value.trim();
    const phone = phoneInput.value;
    
    hideError('usernameError');
    hideError('phoneError');
    hideSuccess('usernameSuccess');
    
    const usernameValidation = await validateUsername(username, isLoginMode);
    if (!usernameValidation.valid) {
        showError('usernameError', usernameValidation.error);
        return;
    }
    
    const phoneValidation = validateBrazilianPhone(phone);
    if (!phoneValidation.valid) {
        showError('phoneError', phoneValidation.error);
        return;
    }
    
    if (isLoginMode) {
        // LOGIN MODE
        let user = null;
        
        if (checkSupabaseAvailable()) {
            try {
                const client = getSupabaseClient();
                const { data, error } = await client
                    .from('users')
                    .select('*')
                    .ilike('username', username)
                    .eq('phone', phoneValidation.digits)
                    .single();
                
                if (error || !data) {
                    showError('phoneError', 'Telefone não confere com este usuário');
                    return;
                }
                user = data;
            } catch (error) {
                const users = loadUsersFromLocalStorage();
                user = users.find(u => 
                    u.username.toLowerCase() === username.toLowerCase() && 
                    u.phone === phoneValidation.digits
                );
            }
        } else {
            const users = loadUsersFromLocalStorage();
            user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() && 
                u.phone === phoneValidation.digits
            );
        }
        
        if (!user) {
            showError('phoneError', 'Telefone não confere com este usuário');
            return;
        }
        
        // Ensure user has ID
        if (!user.id && checkSupabaseAvailable()) {
            try {
                const client = getSupabaseClient();
                const { data: supabaseUser } = await client
                    .from('users')
                    .select('*')
                    .ilike('username', username)
                    .eq('phone', phoneValidation.digits)
                    .single();
                
                if (supabaseUser) {
                    user = normalizeUser(supabaseUser);
                } else {
                    const savedUser = await saveUser({
                        username: user.username,
                        phone: user.phone,
                        phoneFormatted: user.phoneFormatted
                    });
                    if (savedUser && savedUser.id) {
                        user = savedUser;
                    }
                }
            } catch (error) {
                // Continue with localStorage user
            }
        }
        
        const normalizedUser = normalizeUser(user);
        localStorage.setItem('hypeCurrentUser', JSON.stringify(normalizedUser));
        window.location.href = 'quiz.html';
        
    } else {
        // REGISTER MODE
        const phoneExistsCheck = await phoneExists(phoneValidation.digits);
        if (phoneExistsCheck) {
            showError('phoneError', 'Este telefone já está cadastrado');
            return;
        }
        
        const newUser = {
            username: username,
            phone: phoneValidation.digits,
            phoneFormatted: phoneValidation.formatted,
            createdAt: new Date().toISOString()
        };
        
        const savedUser = await saveUser(newUser);
        
        if (!savedUser) {
            showError('phoneError', 'Erro ao criar conta. Tente novamente.');
            return;
        }
        
        localStorage.setItem('hypeCurrentUser', JSON.stringify(savedUser));
        window.location.href = 'quiz.html';
    }
}

function initAuthForm() {
    try {
        const form = document.getElementById('authForm');
        const phoneInput = document.getElementById('phone');
        const usernameInput = document.getElementById('username');
        const toggleModeBtn = document.getElementById('toggleModeBtn');
        
        if (!form || !phoneInput || !usernameInput || !toggleModeBtn) {
            return false;
        }
        
        phoneInput.addEventListener('input', () => {
                formatPhoneInput(phoneInput);
                hideError('phoneError');
        });
        
        usernameInput.addEventListener('blur', async () => {
                if (!isLoginMode && usernameInput.value.trim()) {
                    const validation = await validateUsername(usernameInput.value.trim(), false);
                    if (validation.valid) {
                        hideError('usernameError');
                        showSuccess('usernameSuccess', '✓ Nome de usuário disponível');
                    } else {
                        hideSuccess('usernameSuccess');
                        showError('usernameError', validation.error);
                    }
            }
        });
        
        usernameInput.addEventListener('input', () => {
            hideError('usernameError');
            hideSuccess('usernameSuccess');
            usernameInput.classList.remove('error');
        });
        
        // Add event listeners
        form.addEventListener('submit', handleSubmit);
        
        // Also add click listener to submit button as backup
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                // Don't prevent default here, let form submit handle it
                // But ensure form submission works
                if (form.checkValidity()) {
                    // Form is valid, let submit handler take over
                } else {
                    // Form is invalid, trigger validation
                    form.reportValidity();
                }
            });
        }
        
        toggleModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMode();
        });
        
        console.log('Auth form initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing auth form:', error);
        return false;
    }
}

function initializeFormMode() {
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    
    if (!isLoginMode) {
        // Modo de registro (padrão agora)
        if (pageTitle) pageTitle.textContent = 'Registro';
        if (pageSubtitle) pageSubtitle.textContent = 'Crie sua conta para começar';
        if (submitBtn) submitBtn.textContent = 'Criar Conta';
        if (toggleText) toggleText.textContent = 'Já tem uma conta?';
        if (toggleModeBtn) toggleModeBtn.textContent = 'Fazer login';
    }
}

// Initialize when DOM is ready
function initializeAuth() {
    initializeFormMode(); // Configurar modo de registro
    
    // Try multiple times to ensure elements are ready
    let attempts = 0;
    const maxAttempts = 15;
    
    const tryInit = () => {
        attempts++;
        const form = document.getElementById('authForm');
        const toggleBtn = document.getElementById('toggleModeBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (form && toggleBtn && submitBtn) {
            // Remove any existing listeners by cloning
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            // Re-get elements
            const finalForm = document.getElementById('authForm');
            const finalToggleBtn = document.getElementById('toggleModeBtn');
            const finalSubmitBtn = document.getElementById('submitBtn');
            const finalPhoneInput = document.getElementById('phone');
            const finalUsernameInput = document.getElementById('username');
            
            if (finalForm && finalToggleBtn && finalSubmitBtn) {
                // Add all event listeners
                finalForm.addEventListener('submit', handleSubmit);
                finalSubmitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleSubmit(e);
                });
                finalToggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMode();
                });
                
                if (finalPhoneInput) {
                    finalPhoneInput.addEventListener('input', () => {
                        formatPhoneInput(finalPhoneInput);
                        hideError('phoneError');
                    });
                }
                
                if (finalUsernameInput) {
                    finalUsernameInput.addEventListener('blur', async () => {
                        if (!isLoginMode && finalUsernameInput.value.trim()) {
                            const validation = await validateUsername(finalUsernameInput.value.trim(), false);
                            if (validation.valid) {
                                hideError('usernameError');
                                showSuccess('usernameSuccess', '✓ Nome de usuário disponível');
                            } else {
                                hideSuccess('usernameSuccess');
                                showError('usernameError', validation.error);
                            }
                        }
                    });
                    
                    finalUsernameInput.addEventListener('input', () => {
                        hideError('usernameError');
                        hideSuccess('usernameSuccess');
                        finalUsernameInput.classList.remove('error');
                    });
                }
                
                console.log('Auth form initialized successfully');
                return true;
            }
        }
        
        if (attempts < maxAttempts) {
            setTimeout(tryInit, 200);
        } else {
            console.error('Failed to initialize auth form after', maxAttempts, 'attempts');
            alert('Erro ao inicializar formulário. Por favor, recarregue a página.');
        }
        
        return false;
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tryInit, 100);
        });
    } else {
        setTimeout(tryInit, 100);
    }
}

// Start initialization when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
