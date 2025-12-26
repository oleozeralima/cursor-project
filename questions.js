// 30 Personality Questions for Professional Assessment - BIG 5 Model
const questions = [
    {
        id: 1,
        trait: 'Amabilidade',
        question: 'Como você toma decisões baseadas em valores pessoais ou fatos objetivos?',
        left: "Para mim, as soluções tornam-se claras quando se relacionam às minhas convicções",
        right: "Para mim, as soluções tornam-se claras quando se relacionam aos fatos",
        leftLabel: "Orientado por Valores",
        rightLabel: "Orientado por Fatos"
    },
    {
        id: 2,
        trait: 'Abertura',
        question: 'Você tende a ver o quadro geral ou focar nos detalhes específicos?',
        left: "Costumo ver o problema por inteiro, mas frequentemente perco os pormenores",
        right: "Costumo ver bem os pormenores dos problemas, mas frequentemente tenho dificuldade de ver o todo",
        leftLabel: "Visão Geral",
        rightLabel: "Foco em Detalhes"
    },
    {
        id: 3,
        trait: 'Extroversão',
        question: 'Você processa pensamentos falando em voz alta ou refletindo silenciosamente?',
        left: "Falo muito e isso me ajuda a pensar",
        right: "Penso muito antes de falar",
        leftLabel: "Extrovertido",
        rightLabel: "Introvertido"
    },
    {
        id: 4,
        trait: 'Abertura',
        question: 'Você prefere experimentar novas abordagens ou seguir métodos comprovados?',
        left: "Gosto de experimentar novas maneiras de fazer as coisas",
        right: "Gosto de resolver os problemas de uma maneira prática e sistemática",
        leftLabel: "Inovador",
        rightLabel: "Metódico"
    },
    {
        id: 5,
        trait: 'Amabilidade',
        question: 'Em situações de pressão, você prioriza razão prática ou princípios pessoais?',
        left: "Sob pressão, a razão deve vir antes de princípios pessoais",
        right: "Sob pressão, princípios pessoais devem vir antes da razão",
        leftLabel: "Pragmático",
        rightLabel: "Principista"
    },
    {
        id: 6,
        trait: 'Extroversão',
        question: 'Você prefere trabalhar colaborativamente em equipe ou de forma independente?',
        left: "Prefiro trabalhar em equipe e colaborar com outros",
        right: "Prefiro trabalhar de forma independente e ter controle total",
        leftLabel: "Social",
        rightLabel: "Independente"
    },
    {
        id: 7,
        trait: 'Conscienciosidade',
        question: 'Você toma decisões rapidamente ou prefere analisar todas as opções primeiro?',
        left: "Tomar decisões rápidas é mais importante que analisar todas as opções",
        right: "Analisar todas as opções é mais importante que tomar decisões rápidas",
        leftLabel: "Impulsivo",
        rightLabel: "Reflexivo"
    },
    {
        id: 8,
        trait: 'Abertura',
        question: 'Você valoriza mais a criatividade e inovação ou a eficiência e organização?',
        left: "Valorizo mais a criatividade e inovação",
        right: "Valorizo mais a eficiência e organização",
        leftLabel: "Criativo",
        rightLabel: "Organizado"
    },
    {
        id: 9,
        trait: 'Conscienciosidade',
        question: 'Você prefere seguir procedimentos estabelecidos ou criar seus próprios métodos?',
        left: "Gosto de seguir procedimentos estabelecidos",
        right: "Gosto de criar meus próprios métodos",
        leftLabel: "Estruturado",
        rightLabel: "Flexível"
    },
    {
        id: 10,
        trait: 'Abertura',
        question: 'Você prefere ambientes estruturados e previsíveis ou dinâmicos e em mudança?',
        left: "Prefiro ambientes estruturados e previsíveis",
        right: "Prefiro ambientes dinâmicos e em constante mudança",
        leftLabel: "Previsível",
        rightLabel: "Dinâmico"
    },
    {
        id: 11,
        trait: 'Abertura',
        question: 'Você baseia decisões mais em dados e métricas ou em intuição e experiência?',
        left: "Acredito que dados e métricas são fundamentais para decisões",
        right: "Acredito que intuição e experiência são fundamentais para decisões",
        leftLabel: "Analítico",
        rightLabel: "Intuitivo"
    },
    {
        id: 12,
        trait: 'Extroversão',
        question: 'Você prefere liderar e tomar iniciativa ou seguir e apoiar outros?',
        left: "Gosto de liderar e tomar a iniciativa",
        right: "Gosto de seguir e apoiar a visão de outros",
        leftLabel: "Líder",
        rightLabel: "Seguidor"
    },
    {
        id: 13,
        trait: 'Conscienciosidade',
        question: 'Você trabalha melhor focando em uma tarefa por vez ou múltiplas tarefas simultaneamente?',
        left: "Prefiro focar em uma tarefa de cada vez",
        right: "Prefiro trabalhar em múltiplas tarefas simultaneamente",
        leftLabel: "Focado",
        rightLabel: "Multitarefa"
    },
    {
        id: 14,
        trait: 'Abertura',
        question: 'Você valoriza mais estabilidade e segurança ou crescimento e desafios?',
        left: "Valorizo mais a estabilidade e segurança",
        right: "Valorizo mais o crescimento e desafios",
        leftLabel: "Conservador",
        rightLabel: "Aventureiro"
    },
    {
        id: 15,
        trait: 'Conscienciosidade',
        question: 'Você gosta de planejar tudo com antecedência ou ser espontâneo e adaptável?',
        left: "Gosto de planejar tudo com antecedência",
        right: "Gosto de ser espontâneo e adaptável",
        leftLabel: "Planejador",
        rightLabel: "Espontâneo"
    },
    {
        id: 16,
        trait: 'Amabilidade',
        question: 'Você prefere comunicação direta e objetiva ou diplomática e contextual?',
        left: "Prefiro comunicação direta e objetiva",
        right: "Prefiro comunicação diplomática e contextual",
        leftLabel: "Direto",
        rightLabel: "Diplomático"
    },
    {
        id: 17,
        trait: 'Amabilidade',
        question: 'Você acredita que competição ou colaboração motiva mais as pessoas?',
        left: "Acredito que competição motiva as pessoas",
        right: "Acredito que colaboração motiva as pessoas",
        leftLabel: "Competitivo",
        rightLabel: "Colaborativo"
    },
    {
        id: 18,
        trait: 'Neuroticismo',
        question: 'Você trabalha melhor sob pressão de prazos apertados ou com tempo suficiente?',
        left: "Gosto de trabalhar com prazos apertados",
        right: "Gosto de ter tempo suficiente para fazer bem feito",
        leftLabel: "Resistente a Pressão",
        rightLabel: "Prefere Calma"
    },
    {
        id: 19,
        trait: 'Abertura',
        question: 'Você valoriza mais resultados quantitativos (números) ou qualitativos (experiências)?',
        left: "Valorizo mais resultados quantitativos",
        right: "Valorizo mais resultados qualitativos",
        leftLabel: "Quantitativo",
        rightLabel: "Qualitativo"
    },
    {
        id: 20,
        trait: 'Extroversão',
        question: 'Você prefere ambientes formais e profissionais ou informais e descontraídos?',
        left: "Prefiro ambientes formais e profissionais",
        right: "Prefiro ambientes informais e descontraídos",
        leftLabel: "Formal",
        rightLabel: "Descontraído"
    },
    {
        id: 21,
        trait: 'Extroversão',
        question: 'Você gosta de receber feedback constante ou trabalhar autonomamente?',
        left: "Gosto de receber feedback constante",
        right: "Gosto de trabalhar autonomamente sem interferência",
        leftLabel: "Social",
        rightLabel: "Autônomo"
    },
    {
        id: 22,
        trait: 'Neuroticismo',
        question: 'Como você vê erros: como algo a evitar a todo custo ou oportunidades de aprendizado?',
        left: "Acredito que erros devem ser evitados a todo custo",
        right: "Acredito que erros são oportunidades de aprendizado",
        leftLabel: "Ansioso",
        rightLabel: "Calmo"
    },
    {
        id: 23,
        trait: 'Conscienciosidade',
        question: 'Você prefere seguir regras estabelecidas ou questionar e melhorar processos?',
        left: "Prefiro seguir regras e políticas estabelecidas",
        right: "Prefiro questionar e melhorar regras existentes",
        leftLabel: "Conformista",
        rightLabel: "Questionador"
    },
    {
        id: 24,
        trait: 'Abertura',
        question: 'Você valoriza mais experiência e tradição ou novas ideias e tecnologias?',
        left: "Valorizo mais a experiência e tradição",
        right: "Valorizo mais novas ideias e tecnologias",
        leftLabel: "Tradicional",
        rightLabel: "Inovador"
    },
    {
        id: 25,
        trait: 'Extroversão',
        question: 'Você prefere trabalhar com números e dados ou com pessoas e relacionamentos?',
        left: "Gosto de trabalhar com números e dados",
        right: "Gosto de trabalhar com pessoas e relacionamentos",
        leftLabel: "Analítico",
        rightLabel: "Social"
    },
    {
        id: 26,
        trait: 'Extroversão',
        question: 'Você prefere ambientes silenciosos e focados ou movimentados e interativos?',
        left: "Prefiro ambientes silenciosos e focados",
        right: "Prefiro ambientes movimentados e interativos",
        leftLabel: "Introvertido",
        rightLabel: "Extrovertido"
    },
    {
        id: 27,
        trait: 'Conscienciosidade',
        question: 'Você acredita que processos ou resultados são mais importantes?',
        left: "Acredito que processos são mais importantes",
        right: "Acredito que resultados são mais importantes",
        leftLabel: "Processual",
        rightLabel: "Resultado"
    },
    {
        id: 28,
        trait: 'Amabilidade',
        question: 'Você gosta de responsabilidades claras e definidas ou flexibilidade e múltiplas responsabilidades?',
        left: "Gosto de ter responsabilidades claras e definidas",
        right: "Gosto de ter flexibilidade e múltiplas responsabilidades",
        leftLabel: "Definido",
        rightLabel: "Flexível"
    },
    {
        id: 29,
        trait: 'Conscienciosidade',
        question: 'Você valoriza mais consistência ou adaptabilidade?',
        left: "Valorizo mais a consistência",
        right: "Valorizo mais a adaptabilidade",
        leftLabel: "Consistente",
        rightLabel: "Adaptável"
    },
    {
        id: 30,
        trait: 'Neuroticismo',
        question: 'Você prefere trabalhar em projetos de longo prazo ou projetos de curto prazo?',
        left: "Prefiro trabalhar em projetos de longo prazo",
        right: "Prefiro trabalhar em projetos de curto prazo",
        leftLabel: "Estável",
        rightLabel: "Variável"
    }
];
