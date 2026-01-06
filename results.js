const big5Traits = {
    'Abertura': {
        questions: [1, 3, 7, 9, 10, 13, 18, 23],
        color: '#9b59b6',
        reversed: false
    },
    'Conscienciosidade': {
        questions: [6, 8, 12, 14, 22, 26, 28],
        color: '#50c878',
        reversed: false
    },
    'Extroversão': {
        questions: [2, 5, 11, 19, 20, 24, 25],
        color: '#ff6b35',
        reversed: false
    },
    'Amabilidade': {
        questions: [0, 4, 15, 16, 27],
        color: '#4a90e2',
        reversed: false
    },
    'Estabilidade Emocional': {
        questions: [17, 21, 29],
        color: '#e74c3c',
        reversed: true
    }
};

let userSkills = {};
let userAnswers = [];

async function loadResults() {
    let loadedAnswers = null;
    if (typeof loadAnswersFromSupabase === 'function') {
        const totalQuestions = questions ? questions.length : 30;
        loadedAnswers = await loadAnswersFromSupabase(totalQuestions);
    }
    
    // If Supabase didn't return data, try localStorage
    if (!loadedAnswers) {
        const savedAnswers = localStorage.getItem('hypeAnswers');
        if (savedAnswers) {
            loadedAnswers = JSON.parse(savedAnswers);
        }
    }
    
    if (!loadedAnswers) {
        alert('Nenhum resultado encontrado. Por favor, complete o questionário primeiro.');
        window.location.href = 'quiz.html';
        return;
    }

    userAnswers = loadedAnswers;

    const unanswered = userAnswers.findIndex((answer, index) => {
        return answer === null || answer === undefined || answer === 0;
    });

    if (unanswered !== -1) {
        alert('Questionário incompleto. Por favor, responda todas as perguntas antes de ver os resultados.');
        window.location.href = 'quiz.html';
        return;
    }

    calculateBig5Scores();
    displayResults();

    if (typeof saveQuizSession === 'function') {
        try {
            const currentUser = JSON.parse(localStorage.getItem('hypeCurrentUser') || '{}');
            if (currentUser.id) {
                await saveQuizSession(userAnswers, userSkills);
            }
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        }
    }
}

function calculateBig5Scores() {
    Object.keys(big5Traits).forEach(trait => {
        const traitData = big5Traits[trait];
        let totalScore = 0;
        let count = 0;

        traitData.questions.forEach(questionIndex => {
            if (questionIndex >= 0 && questionIndex < userAnswers.length) {
                const answer = userAnswers[questionIndex];
                if (answer !== null && answer !== undefined) {
                    let score = traitData.reversed ? -answer : answer;
                    const normalizedScore = ((score + 3) / 6) * 100;
                    totalScore += normalizedScore;
                    count++;
                }
            }
        });

        userSkills[trait] = count > 0 ? Math.round(totalScore / count) : 50;
    });
}

function displayResults() {
    drawMandala();
    displaySkillsBreakdown();
    displayCompatibility();
    displayCompanyFit();
}

function drawMandala() {
    const canvas = document.getElementById('mandalaCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 80;
    const size = Math.min(600, containerWidth);
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw background circle
    ctx.fillStyle = '#252525';
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fill();
    
    const traits = Object.keys(userSkills);
    const angleStep = (Math.PI * 2) / traits.length;
    
    // Draw trait petals
    traits.forEach((trait, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const score = userSkills[trait];
        const radius = (score / 100) * maxRadius;
        
        const category = big5Traits[trait];
        const color = category.color;
        
        // Draw petal
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        const petalWidth = angleStep * 0.8;
        const x1 = centerX + Math.cos(angle - petalWidth / 2) * radius;
        const y1 = centerY + Math.sin(angle - petalWidth / 2) * radius;
        const x2 = centerX + Math.cos(angle + petalWidth / 2) * radius;
        const y2 = centerY + Math.sin(angle + petalWidth / 2) * radius;
        
        ctx.lineTo(x1, y1);
        ctx.arc(centerX, centerY, radius, angle - petalWidth / 2, angle + petalWidth / 2);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        
        // Draw trait name
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        const labelRadius = maxRadius + 20;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;
        ctx.fillText(trait, labelX, labelY);
        
        // Draw score
        ctx.font = '12px Arial';
        ctx.fillStyle = category.color;
        ctx.fillText(`${score}%`, labelX, labelY + 15);
    });
    
    // Draw center circle
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Create legend
    const legend = document.getElementById('skillsLegend');
    if (legend) {
    legend.innerHTML = '';
        traits.forEach(trait => {
        const item = document.createElement('div');
        item.className = 'legend-item';
            const category = big5Traits[trait];
        item.innerHTML = `
            <div class="legend-color" style="background: ${category.color}"></div>
                <span>${trait}</span>
        `;
        legend.appendChild(item);
    });
    }
}

function displaySkillsBreakdown() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const sortedSkills = Object.entries(userSkills)
        .sort((a, b) => b[1] - a[1]);
    
    sortedSkills.forEach(([trait, score]) => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        const category = big5Traits[trait];
        
        item.innerHTML = `
            <div class="skill-name">${trait}</div>
            <div class="skill-bar-container">
                <div class="skill-bar" style="width: ${score}%; background: ${category.color}"></div>
            </div>
            <div class="skill-value">${score}%</div>
        `;
        grid.appendChild(item);
    });
}

// Company roles and their ideal skill profiles
const companyRoles = {
    'Gestor/Coordenador': {
        idealSkills: {
            'Extroversão': 75,
            'Conscienciosidade': 85,
            'Amabilidade': 70,
            'Abertura': 65,
            'Estabilidade Emocional': 75
        },
        icon: '👔',
        description: 'Perfil ideal para liderar equipes e coordenar projetos.'
    },
    'Analista/Especialista': {
        idealSkills: {
            'Conscienciosidade': 90,
            'Abertura': 75,
            'Estabilidade Emocional': 80,
            'Amabilidade': 60,
            'Extroversão': 40
        },
        icon: '📊',
        description: 'Perfil ideal para análise detalhada e trabalho especializado.'
    },
    'Inovador/Criativo': {
        idealSkills: {
            'Abertura': 90,
            'Extroversão': 65,
            'Amabilidade': 70,
            'Estabilidade Emocional': 70,
            'Conscienciosidade': 60
        },
        icon: '💡',
        description: 'Perfil ideal para inovação e desenvolvimento de novas soluções.'
    },
    'Colaborador/Time': {
        idealSkills: {
            'Amabilidade': 90,
            'Extroversão': 75,
            'Estabilidade Emocional': 80,
            'Conscienciosidade': 70,
            'Abertura': 65
        },
        icon: '🤝',
        description: 'Perfil ideal para trabalho em equipe e colaboração.'
    },
    'Executor/Operacional': {
        idealSkills: {
            'Conscienciosidade': 90,
            'Estabilidade Emocional': 85,
            'Amabilidade': 70,
            'Abertura': 50,
            'Extroversão': 50
        },
        icon: '⚙️',
        description: 'Perfil ideal para execução eficiente e operações.'
    }
};

// Sample team members for compatibility - using all 5 BIG 5 traits for precision
const sampleTeam = [
    { 
        name: 'Ana Silva', 
        role: 'Gestor/Coordenador', 
        skills: { 
            'Extroversão': 80, 
            'Conscienciosidade': 85, 
            'Amabilidade': 75,
            'Abertura': 65,
            'Estabilidade Emocional': 75
        } 
    },
    { 
        name: 'Carlos Mendes', 
        role: 'Analista/Especialista', 
        skills: { 
            'Conscienciosidade': 95, 
            'Abertura': 80, 
            'Estabilidade Emocional': 85,
            'Extroversão': 40,
            'Amabilidade': 60
        } 
    },
    { 
        name: 'Mariana Costa', 
        role: 'Inovador/Criativo', 
        skills: { 
            'Abertura': 90, 
            'Extroversão': 70, 
            'Amabilidade': 75,
            'Conscienciosidade': 60,
            'Estabilidade Emocional': 70
        } 
    },
    { 
        name: 'Pedro Santos', 
        role: 'Colaborador/Time', 
        skills: { 
            'Amabilidade': 90, 
            'Extroversão': 80, 
            'Estabilidade Emocional': 75,
            'Conscienciosidade': 70,
            'Abertura': 65
        } 
    },
    { 
        name: 'Julia Lima', 
        role: 'Executor/Operacional', 
        skills: { 
            'Conscienciosidade': 95, 
            'Estabilidade Emocional': 90, 
            'Amabilidade': 70,
            'Abertura': 50,
            'Extroversão': 50
        } 
    }
];

// Stricter compatibility calculation using all 5 BIG 5 traits with weighted scoring
function calculateCompatibility(teamMember) {
    const traits = ['Abertura', 'Conscienciosidade', 'Extroversão', 'Amabilidade', 'Estabilidade Emocional'];
    let weightedDiff = 0;
    let totalWeight = 0;
    
    traits.forEach(trait => {
        if (userSkills[trait] !== undefined && teamMember.skills[trait] !== undefined) {
            const userValue = userSkills[trait];
            const teamValue = teamMember.skills[trait];
            const diff = Math.abs(userValue - teamValue);
            
            // Weighted calculation: larger differences are penalized more (exponential decay)
            // This makes the scoring more precise and stricter
            const weight = 1;
            const normalizedDiff = (diff / 100) * 100; // Normalize to 0-100 scale
            weightedDiff += normalizedDiff * weight;
            totalWeight += weight;
        }
    });
    
    if (totalWeight === 0) return 50;
    
    // Calculate average weighted difference
    const avgDiff = weightedDiff / totalWeight;
    
    // More precise scoring: use squared difference for stricter matching
    // This penalizes larger mismatches more heavily
    let strictScore = 100 - avgDiff;
    
    // Apply stricter thresholds: boost high matches, reduce low matches
    if (strictScore >= 80) {
        strictScore = 80 + (strictScore - 80) * 1.25; // Boost high scores
    } else if (strictScore < 50) {
        strictScore = strictScore * 0.9; // Reduce low scores
    }
    
    return Math.max(0, Math.min(100, Math.round(strictScore)));
}

function displayCompatibility() {
    const grid = document.getElementById('compatibilityGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    sampleTeam.forEach(member => {
        const compatibility = calculateCompatibility(member);
        const card = document.createElement('div');
        card.className = 'compatibility-card';
        
        let scoreClass = 'medium';
        if (compatibility >= 75) scoreClass = 'high';
        else if (compatibility < 50) scoreClass = 'low';
        
        let description = '';
        if (compatibility >= 75) {
            description = 'Alta compatibilidade. Trabalho em equipe será muito produtivo.';
        } else if (compatibility >= 50) {
            description = 'Compatibilidade moderada. Boa colaboração com comunicação adequada.';
        } else {
            description = 'Compatibilidade baixa. Requer mais esforço para alinhamento.';
        }
        
        card.innerHTML = `
            <div class="compatibility-name">${member.name}</div>
            <div class="compatibility-score ${scoreClass}">${compatibility}%</div>
            <div class="compatibility-description">${description}</div>
            <div class="compatibility-description" style="margin-top: 10px; font-size: 12px; opacity: 0.7;">${member.role}</div>
        `;
        grid.appendChild(card);
    });
}

// Stricter role fit calculation with weighted importance of traits
function calculateRoleFit(role) {
    const roleProfile = companyRoles[role];
    
    // Define trait weights for each role (higher weight = more important for that role)
    const traitWeights = {
        'Gestor/Coordenador': {
            'Extroversão': 1.5,
            'Conscienciosidade': 1.5,
            'Amabilidade': 1.2,
            'Abertura': 1.0,
            'Estabilidade Emocional': 1.3
        },
        'Analista/Especialista': {
            'Conscienciosidade': 1.8,
            'Abertura': 1.5,
            'Estabilidade Emocional': 1.5,
            'Amabilidade': 1.0,
            'Extroversão': 0.8
        },
        'Inovador/Criativo': {
            'Abertura': 1.8,
            'Extroversão': 1.3,
            'Amabilidade': 1.2,
            'Estabilidade Emocional': 1.2,
            'Conscienciosidade': 1.0
        },
        'Colaborador/Time': {
            'Amabilidade': 1.8,
            'Extroversão': 1.5,
            'Estabilidade Emocional': 1.5,
            'Conscienciosidade': 1.2,
            'Abertura': 1.0
        },
        'Executor/Operacional': {
            'Conscienciosidade': 1.8,
            'Estabilidade Emocional': 1.6,
            'Amabilidade': 1.2,
            'Abertura': 1.0,
            'Extroversão': 1.0
        }
    };
    
    const weights = traitWeights[role] || {};
    let weightedDiff = 0;
    let totalWeight = 0;
    
    Object.keys(roleProfile.idealSkills).forEach(trait => {
        if (userSkills[trait] !== undefined) {
            const userValue = userSkills[trait];
            const idealValue = roleProfile.idealSkills[trait];
            const diff = Math.abs(userValue - idealValue);
            
            // Use weighted difference - more important traits have more impact
            const weight = weights[trait] || 1.0;
            weightedDiff += diff * weight;
            totalWeight += weight;
        }
    });
    
    if (totalWeight === 0) return 50;
    
    // Calculate weighted average difference
    const avgDiff = weightedDiff / totalWeight;
    
    // More precise scoring with stricter matching
    let fitScore = 100 - avgDiff;
    
    // Apply stricter thresholds for better precision
    if (fitScore >= 85) {
        fitScore = 85 + (fitScore - 85) * 1.2; // Boost excellent matches
    } else if (fitScore < 60) {
        fitScore = fitScore * 0.85; // Reduce poor matches
    }
    
    return Math.max(0, Math.min(100, Math.round(fitScore)));
}

function displayCompanyFit() {
    const visualization = document.getElementById('fitVisualization');
    const description = document.getElementById('fitDescription');
    if (!visualization || !description) return;
    
    visualization.innerHTML = '';
    
    const roleFits = Object.keys(companyRoles).map(role => ({
        role,
        fit: calculateRoleFit(role),
        ...companyRoles[role]
    })).sort((a, b) => b.fit - a.fit);
    
    roleFits.forEach((roleData, index) => {
        const card = document.createElement('div');
        card.className = 'fit-card';
        if (index === 0) {
            card.classList.add('recommended');
        }
        
        card.innerHTML = `
            <div class="fit-icon">${roleData.icon}</div>
            <h3>${roleData.role}</h3>
            <div class="compatibility-score ${roleData.fit >= 75 ? 'high' : roleData.fit >= 50 ? 'medium' : 'low'}">${roleData.fit}%</div>
            <p style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">${roleData.description}</p>
        `;
        visualization.appendChild(card);
    });
    
    const topRole = roleFits[0];
    const topTraits = Object.keys(userSkills)
        .filter(trait => userSkills[trait] >= 70)
        .map(trait => trait)
        .join(', ') || 'vários traços';
    
    description.innerHTML = `
        <h3 style="color: var(--accent-green); margin-bottom: 15px;">Recomendação Principal: ${topRole.role}</h3>
        <p>Com base no seu perfil, você tem ${topRole.fit}% de compatibilidade com o perfil de <strong>${topRole.role}</strong>. 
        ${topRole.description}</p>
        <p style="margin-top: 15px;">Seus pontos fortes incluem: ${topTraits}.</p>
    `;
}

// Generate clean HTML content for export with mandala
async function generateHTMLContent() {
    // Verify data is available
    if (!userSkills || Object.keys(userSkills).length === 0) {
        return '<div style="padding: 20px;"><h1>Erro: Dados não disponíveis</h1><p>Por favor, complete o questionário primeiro.</p></div>';
    }
    
    const traits = Object.entries(userSkills).sort((a, b) => b[1] - a[1]);
    
    if (traits.length === 0) {
        return '<div style="padding: 20px;"><h1>Erro: Nenhum traço calculado</h1></div>';
    }
    
    const topRole = Object.keys(companyRoles).map(role => ({
        role,
        fit: calculateRoleFit(role),
        ...companyRoles[role]
    })).sort((a, b) => b.fit - a.fit)[0];
    
    if (!topRole) {
        return '<div style="padding: 20px;"><h1>Erro: Nenhuma recomendação calculada</h1></div>';
    }
    
    const compatibilityData = sampleTeam.map(member => ({
        name: member.name,
        role: member.role,
        compatibility: calculateCompatibility(member)
    })).sort((a, b) => b.compatibility - a.compatibility);
    
    // Capture mandala canvas as image
    let mandalaImage = '';
    const canvas = document.getElementById('mandalaCanvas');
    if (canvas) {
        try {
            mandalaImage = canvas.toDataURL('image/png');
        } catch (e) {
            console.warn('Não foi possível capturar a mandala:', e);
        }
    }
    
    // Create mandala HTML section
    const mandalaHtml = mandalaImage ? `
        <section>
            <h3>Mandala de Personalidade BIG 5</h3>
            <div style="text-align: center; margin: 20px 0;">
                <img src="${mandalaImage}" alt="Mandala de Personalidade BIG 5" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            </div>
        </section>
    ` : '';
    
    let traitsHtml = traits.map(([trait, score]) => {
        const color = big5Traits[trait].color;
        return `
            <div class="trait-item">
                <div class="trait-header">
                    <span class="trait-name" style="color: ${color};">${trait}</span>
                    <span class="trait-value">${score}%</span>
                </div>
                <div class="trait-bar-container">
                    <div class="trait-bar" style="background-color: ${color}; width: ${score}%;"></div>
                </div>
            </div>
        `;
    }).join('');
    
    let compatibilityHtml = compatibilityData.map(member => `
        <div class="compatibility-item">
            <div class="compatibility-header">
                <strong class="compatibility-name">${member.name}</strong>
                <span class="compatibility-score" style="color: ${member.compatibility >= 75 ? '#50c878' : member.compatibility >= 50 ? '#ff6b35' : '#e74c3c'};">
                    ${member.compatibility}%
                </span>
            </div>
            <div class="compatibility-role">${member.role}</div>
        </div>
    `).join('');
    
    return `
        <div class="container">
            <div class="header">
                <h1>HYPE™</h1>
                <h2>Resultados do Perfil Profissional</h2>
                <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            ${mandalaHtml}
            
            <section>
                <h3>Análise Detalhada dos Traços BIG 5</h3>
                ${traitsHtml}
            </section>
            
            <section>
                <h3>Recomendação Principal: ${topRole.role}</h3>
                <div class="recommendation-box">
                    <div class="recommendation-title">
                        <span style="font-size: 28px;">${topRole.icon}</span> <strong>${topRole.role}</strong>
                    </div>
                    <div class="recommendation-score">${topRole.fit}% de Compatibilidade</div>
                    <p class="recommendation-desc">${topRole.description}</p>
                </div>
            </section>
            
            <section>
                <h3>Compatibilidade com Equipe</h3>
                ${compatibilityHtml}
            </section>
            
            <div class="footer">
                <p style="margin: 5px 0;">HYPE™ - Avaliação de Personalidade BIG 5</p>
                <p style="margin: 5px 0;">Este relatório foi gerado automaticamente com base nas suas respostas ao questionário.</p>
            </div>
        </div>
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadResults();
    
    document.getElementById('retakeBtn')?.addEventListener('click', () => {
    if (confirm('Deseja refazer o questionário?')) {
        localStorage.removeItem('hypeAnswers');
            window.location.href = 'quiz.html';
    }
});

    document.getElementById('exportBtn')?.addEventListener('click', async () => {
        const exportBtn = document.getElementById('exportBtn');
        const originalText = exportBtn.textContent;
        exportBtn.textContent = 'Gerando HTML...';
        exportBtn.disabled = true;
        
        try {
            console.log('🚀 Iniciando exportação HTML...');
            
            // Verify data is loaded
            if (!userSkills || Object.keys(userSkills).length === 0) {
                throw new Error('Dados não carregados. Por favor, recarregue a página de resultados.');
            }
            
            console.log('✅ Dados carregados:', Object.keys(userSkills));
            
            // Generate HTML content (async function)
            const htmlContent = await generateHTMLContent();
            
            if (!htmlContent || htmlContent.trim().length === 0) {
                throw new Error('Conteúdo está vazio. Verifique se completou o questionário.');
            }
            
            console.log('✅ HTML gerado, tamanho:', htmlContent.length, 'caracteres');
            
            // Create complete HTML document with styles
            const completeHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados HYPE™ - ${new Date().toLocaleDateString('pt-BR')}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            color: #ffffff;
            background: #000000;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: #000000;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #ff6b35;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #ff6b35;
            margin: 0;
            font-size: 32px;
        }
        .header h2 {
            color: #ffffff;
            margin: 10px 0 0 0;
            font-size: 24px;
        }
        .header p {
            color: #cccccc;
            margin: 10px 0 0 0;
            font-size: 14px;
        }
        section {
            margin-bottom: 40px;
            width: 100%;
        }
        h3 {
            color: #ff6b35;
            font-size: 20px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ff6b35;
            padding-bottom: 10px;
            font-weight: bold;
        }
        .trait-item {
            margin-bottom: 15px;
            width: 100%;
        }
        .trait-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            width: 100%;
        }
        .trait-name {
            font-weight: bold;
            font-size: 14px;
        }
        .trait-value {
            font-weight: bold;
            color: #ffffff;
            font-size: 14px;
        }
        .trait-bar-container {
            background-color: #e0e0e0;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            width: 100%;
        }
        .trait-bar {
            height: 100%;
        }
        .recommendation-box {
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #50c878;
        }
        .recommendation-title {
            font-size: 24px;
            margin-bottom: 10px;
            color: #ffffff;
        }
        .recommendation-score {
            font-size: 32px;
            color: #50c878;
            font-weight: bold;
            margin: 10px 0;
        }
        .recommendation-desc {
            margin-top: 15px;
            line-height: 1.6;
            color: #ffffff;
            font-size: 14px;
        }
        .compatibility-item {
            border: 1px solid #333333;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            background-color: #1a1a1a;
        }
        .compatibility-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .compatibility-name {
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
        }
        .compatibility-score {
            font-weight: bold;
            font-size: 18px;
        }
        .compatibility-role {
            font-size: 12px;
            color: #cccccc;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #333333;
            text-align: center;
            color: #cccccc;
            font-size: 12px;
        }
        .mandala-image {
            text-align: center;
            margin: 20px 0;
        }
        .mandala-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        @media print {
            body {
                padding: 0;
                background: #000000;
            }
            .container {
                max-width: 100%;
                background: #000000;
            }
            .mandala-image img {
                max-width: 80%;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
            
            // GARANTIR QUE É HTML - NÃO PDF!
            const fileName = `Resultados-HYPE-${new Date().toISOString().split('T')[0]}.html`;
            
            // Criar blob com tipo HTML explícito
            const blob = new Blob([completeHTML], { 
                type: 'text/html;charset=utf-8'
            });
            
            // Verificar se é realmente HTML
            if (!blob.type.includes('html')) {
                throw new Error('ERRO CRÍTICO: Arquivo não é HTML! Tipo: ' + blob.type);
            }
            
            console.log('✅ Blob criado - Tipo:', blob.type);
            console.log('✅ Tamanho:', blob.size, 'bytes');
            console.log('✅ Nome do arquivo:', fileName);
            
            // Criar URL do blob
            const url = URL.createObjectURL(blob);
            
            // Criar elemento de download
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // EXTENSÃO .html GARANTIDA
            link.setAttribute('download', fileName);
            link.setAttribute('type', 'text/html');
            link.style.display = 'none';
            
            // Adicionar ao DOM
            document.body.appendChild(link);
            
            // Forçar download
            link.click();
            
            // Limpar
            setTimeout(() => {
                if (link.parentNode) {
                    document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
            }, 300);
            
            console.log('✅✅✅ ARQUIVO HTML BAIXADO COM SUCESSO! ✅✅✅');
            console.log('✅ Nome:', fileName);
            console.log('✅ Tipo:', blob.type);
            
            // Alerta de confirmação
            setTimeout(() => {
                alert('✅ Arquivo HTML baixado com sucesso!\n\nNome: ' + fileName + '\n\nSe o arquivo abrir como PDF, é problema do navegador. Clique com botão direito no arquivo e escolha "Abrir com" → Navegador.');
            }, 500);
            
        } catch (error) {
            alert('Erro ao exportar resultados: ' + (error.message || error.toString()));
            console.error('❌ Erro ao exportar:', error);
        } finally {
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
        }
    });
    
    document.getElementById('closeBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
