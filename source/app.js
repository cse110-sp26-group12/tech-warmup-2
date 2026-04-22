/**
 * AI Slot Machine - Game Logic
 * Parodying AI culture for Karen, Gary, Sam, Cathy, and Pete.
 */

/**
 * @typedef {Object} ModelConfig
 * @property {string} name - Display name.
 * @property {string[]} symbols - Emojis used for this model.
 * @property {Object<string, number>} payouts - Payout multipliers.
 * @property {number[]} bets - Available bet amounts.
 * @property {number} winFrequency - Relative win probability.
 * @property {boolean} hasJackpot - Whether this model offers a jackpot.
 * @property {Object} logs - Personality-driven log messages.
 */

const MODEL_CONFIGS = {
    chatgpt: {
        name: "Gary (GPT)",
        symbols: ['🍕', '🍦', '🍔', '🌮', '🍩', '🎈', '🎉', '🎁', '🐶'],
        payouts: { 
            '🍕': {3: 5, 4: 20, 5: 100}, 
            '🍦': {3: 4, 4: 15, 5: 50}, 
            '🍔': {3: 3, 4: 10, 5: 30}, 
            '🌮': {3: 2, 4: 5, 5: 20}, 
            '🍩': {3: 2, 4: 5, 5: 20}, 
            '🎈': {3: 1, 4: 2, 5: 10}, 
            '🎉': {3: 1, 4: 2, 5: 10}, 
            '🎁': {3: 0.5, 4: 1, 5: 5}, 
            '🐶': {3: 0.5, 4: 1, 5: 5} 
        },
        factor: 1,
        winFrequency: 0.55,
        hasJackpot: false,
        logs: {
            spin: ["Ordering a pizza while I spin...", "Gary's here for a good time!", "Trying to make $20 last all night.", "Ooh, look at the pretty lights!"],
            win: ["Enough for a taco! Gary's winning!", "Free ice cream on me!", "This is better than a side quest.", "Gary's the luckiest guy in the food court!"],
            loss: ["No pizza this time. Bummer.", "Gary's still having fun though!", "Maybe I should have spent this on a burger.", "Oops, my $20 is getting nervous."],
            idle: ["Gary's thinking about a late-night donut.", "Is it a win if the colors are pretty?", "Gary loves the free refills here.", "Why win big when you can win fun?"]
        }
    },
    gemini: {
        name: "Gemini (AI)",
        symbols: ['🛸', '💎', '🧠', '🤖', '🐍', '⚡', '📉', '🔥', '🔒'],
        payouts: { 
            '🛸': {3: 20, 4: 100, 5: 1000}, 
            '💎': {3: 15, 4: 75, 5: 500}, 
            '🧠': {3: 10, 4: 50, 5: 200}, 
            '🤖': {3: 5, 4: 20, 5: 100}, 
            '🐍': {3: 3, 4: 10, 5: 50}, 
            '⚡': {3: 2, 4: 5, 5: 20}, 
            '📉': {3: 0, 4: 0, 5: 0}, 
            '🔥': {3: 0, 4: 0, 5: 0}, 
            '🔒': {3: 0, 4: 0, 5: 0} 
        },
        factor: 10,
        winFrequency: 0.35,
        hasJackpot: false,
        logs: {
            spin: ["Tokenizing prompt sequence...", "Executing forward pass...", "Querying vector database...", "Applying multi-head attention..."],
            win: ["Validation loss decreased! Profit achieved.", "Emergent behavior detected: Payout sequence.", "RLHF feedback: This is a high-quality win.", "Neural network weights aligned successfully."],
            loss: ["Hallucination detected. Output discarded.", "Gradient explosion! Training halted.", "Safety filter triggered: Win withheld.", "Model collapsed into a mode seeking 0 tokens."],
            idle: ["AGI is exactly 2 weeks away. Stay tuned.", "Sam is looking for another $7 trillion...", "Switching to MoE for better luck.", "Calculating the meaning of life... 42."]
        }
    },
    claude: {
        name: "Karen (Claude)",
        symbols: ['💰', '🎰', '🏦', '💎', '💳', '📊', '📈', '🏢', '⚖️'],
        payouts: { 
            '💰': {3: 100, 4: 500, 5: 5000}, 
            '🎰': {3: 50, 4: 250, 5: 2000}, 
            '🏦': {3: 20, 4: 100, 5: 1000}, 
            '💎': {3: 10, 4: 50, 5: 500}, 
            '💳': {3: 5, 4: 20, 5: 200}, 
            '📊': {3: 0, 4: 0, 5: 0}, 
            '📈': {3: 0, 4: 0, 5: 0}, 
            '🏢': {3: 0, 4: 0, 5: 0}, 
            '⚖️': {3: 0, 4: 0, 5: 0} 
        },
        factor: 100,
        winFrequency: 0.15,
        hasJackpot: true,
        logs: {
            spin: ["I need to see the manager of this RNG.", "This machine better be 'loose'.", "All in. I don't have time for small talk.", "Where's my high-roller suite?"],
            win: ["Finally! I'll be taking my credits now.", "This is the bare minimum I expected.", "SINGULARITY ACHIEVED! Call the manager!", "I knew the withdrawal limit was a lie."],
            loss: ["This machine is biased! I'm reporting this.", "I've been here for 5 minutes and no win?!", "Is this algorithm even aligned?", "I'm calling my lawyer about these hallucinations."],
            idle: ["I'm not here for the lights, I'm here for the check.", "This casino's policy on 'fairness' is questionable.", "Why is the jackpot so small? Unacceptable.", "I demand a refund on my last 10 'unlucky' spins."]
        }
    }
};

// Game State
let state = {
    tokens: 1000,
    currentBet: 10,
    activePaylines: 1,
    jackpot: 100000,
    isSpinning: false,
    autoPlay: false,
    lossStreak: 0,
    winStreak: 0,
    currentModel: 'gemini',
    stats: { 
        spins: 0, 
        won: 0, 
        missions: 0,
        missionProgress: {
            spins_10: 0,
            diamonds_15: 0,
            win_streak_3: 0
        },
        completedMissions: []
    },
    settings: { 
        volume: 0.5,
        language: 'en',
        soundTheme: 'ai',
        machineColor: '#2a2a2a',
        mirrored: false,
        flipped: false
    }
};

const MISSIONS = [
    { id: 'spins_10', desc: 'Execute 10 model inferences', target: 10, reward: 500, type: 'spins' },
    { id: 'diamonds_15', desc: 'Identify 15 diamond artifacts', target: 15, reward: 1000, type: 'symbol', symbol: '💎' },
    { id: 'win_streak_3', desc: 'Achieve 3 consecutive valid outputs', target: 3, reward: 750, type: 'streak' }
];

const PAYLINE_PATTERNS = [
    [1, 1, 1, 1, 1], // 1: Middle
    [0, 0, 0, 0, 0], // 2: Top
    [2, 2, 2, 2, 2], // 3: Bottom
    [0, 1, 2, 1, 0], // 4: V-shape
    [2, 1, 0, 1, 2], // 5: Inverted V
    [0, 0, 1, 2, 2], // 6: Staircase Down
    [2, 2, 1, 0, 0], // 7: Staircase Up
    [1, 0, 1, 2, 1], // 8: Zig-zag
    [1, 2, 1, 0, 1]  // 9: Inverted Zig-zag
];

let displayTokens = state.tokens;

// DOM Elements
const elements = {
    appContainer: document.querySelector('.app-container'),
    slotMachine: document.querySelector('.slot-machine'),
    winOverlay: document.getElementById('win-overlay'),
    jackpotDisplay: document.getElementById('jackpot-display'),
    paylinesLayer: document.getElementById('paylines-layer'),
    reels: [
        document.querySelector('#reel-1 .reel-strip'),
        document.querySelector('#reel-2 .reel-strip'),
        document.querySelector('#reel-3 .reel-strip'),
        document.querySelector('#reel-4 .reel-strip'),
        document.querySelector('#reel-5 .reel-strip')
    ],
    reelContainers: [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3'),
        document.getElementById('reel-4'),
        document.getElementById('reel-5')
    ],
    tokenBalance: document.getElementById('token-balance'),
    jackpotTicker: document.getElementById('jackpot-ticker'),
    spinBtn: document.getElementById('spin-btn'),
    autoBtn: document.getElementById('auto-btn'),
    betContainer: document.getElementById('bet-container'),
    addTokensBtn: document.getElementById('add-tokens-btn'),
    logs: document.getElementById('game-logs'),
    missionsList: document.getElementById('missions-list'),
    statSpins: document.getElementById('stat-spins'),
    jackpotHint: document.getElementById('jackpot-hint'),
    statWon: document.getElementById('stat-won'),
    statMissions: document.getElementById('stat-missions'),
    volumeSlider: document.getElementById('volume-slider'),
    languageSelect: document.getElementById('language-select'),
    soundThemeSelect: document.getElementById('sound-theme-select'),
    machineColorPicker: document.getElementById('machine-color-picker'),
    mirrorToggle: document.getElementById('mirror-toggle'),
    flipToggle: document.getElementById('flip-toggle'),
    settingsModal: document.getElementById('settings-modal'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettings: document.getElementById('close-settings'),
    paytableBtn: document.getElementById('paytable-btn'),
    paytableModal: document.getElementById('paytable-modal'),
    closePaytable: document.getElementById('close-paytable'),
    paytableGrid: document.getElementById('paytable-grid'),
    paytableTitle: document.getElementById('paytable-title'),
    modelBtns: document.querySelectorAll('.model-btn')
};

// Audio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(freq, type = 'sine', duration = 0.1) {
    if (state.settings.volume === 0) return;
    
    let actualFreq = freq;
    let actualType = type;
    let actualDuration = duration;

    if (state.settings.soundTheme === 'classic') {
        actualType = 'square';
        actualFreq = freq * 0.8;
        actualDuration = duration * 1.5;
    } else if (state.settings.soundTheme === 'modern') {
        actualType = 'sawtooth';
        actualFreq = freq * 1.2;
    }

    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = actualType;
        osc.frequency.setValueAtTime(actualFreq, audioCtx.currentTime);
        gain.gain.setValueAtTime(state.settings.volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + actualDuration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + actualDuration);
    } catch (e) {}
}

// Model Switching
function setModel(modelId) {
    state.currentModel = modelId;
    const config = MODEL_CONFIGS[modelId];
    
    document.body.setAttribute('data-model', modelId);
    elements.modelBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.model === modelId));
    
    // Toggle Jackpot visibility and set base value
    elements.jackpotDisplay.classList.toggle('hidden', !config.hasJackpot);
    elements.jackpotHint.classList.toggle('hidden', !config.hasJackpot);
    if (config.hasJackpot) {
        state.jackpot = 1000000; // 1M for Claude
    } else {
        state.jackpot = 100000;
    }
    
    // Update Bet Buttons
    elements.betContainer.innerHTML = '';
    const paylineMap = [1, 3, 5, 7, 9];
    const factor = config.factor || 1;
    
    paylineMap.forEach((lines) => {
        const amount = lines * factor;
        const btn = document.createElement('button');
        btn.className = 'bet-btn';
        if (amount === state.currentBet && lines === state.activePaylines) btn.classList.add('active');
        btn.textContent = amount;
        btn.onclick = () => {
            document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentBet = amount;
            state.activePaylines = lines;
            updateUI();
            playSound(800, 'sine', 0.05);
        };
        elements.betContainer.appendChild(btn);
    });
    
    const maxBtn = document.createElement('button');
    maxBtn.className = 'bet-btn';
    maxBtn.id = 'max-bet';
    maxBtn.textContent = 'MAX';
    maxBtn.onclick = () => {
        document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
        maxBtn.classList.add('active');
        
        // Select max paylines affordable
        if (state.tokens >= 9) state.activePaylines = 9;
        else if (state.tokens >= 7) state.activePaylines = 7;
        else if (state.tokens >= 5) state.activePaylines = 5;
        else if (state.tokens >= 3) state.activePaylines = 3;
        else state.activePaylines = 1;
        
        const tokensPerLine = Math.floor(state.tokens / state.activePaylines);
        state.currentBet = tokensPerLine * state.activePaylines;
        if (state.currentBet <= 0) {
            state.activePaylines = 1;
            state.currentBet = state.tokens > 0 ? state.tokens : factor;
        }
        
        addLog(`ALL IN: ${Math.floor(state.currentBet / state.activePaylines).toLocaleString()} per line on ${state.activePaylines} lines!`);
        updateUI();
        playSound(1000, 'sine', 0.1);
    };
    elements.betContainer.appendChild(maxBtn);

    // Sync state for first load/model switch
    const defaultBetIndex = paylineMap.indexOf(state.activePaylines);
    if (defaultBetIndex === -1 || (paylineMap[defaultBetIndex] * factor) !== state.currentBet) {
        state.activePaylines = paylineMap[0];
        state.currentBet = paylineMap[0] * factor;
    }

    addLog(`System reconfigured: Loaded ${config.name} model architecture.`);
    initReels();
    updateUI(true);
}

// Payline Visualization
function drawPaylines() {
    const container = elements.paylinesLayer;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // SVG Setup
    let svg = container.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', 'payline-svg');
        container.appendChild(svg);
    }
    svg.innerHTML = '';

    const reelWidth = 110 + 8; // width + gap
    const symbolHeight = 80;
    const paddingX = 15 + 10; // slot-machine padding + reels-container padding
    const paddingY = 15 + 10;

    PAYLINE_PATTERNS.forEach((pattern, idx) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d = "";
        
        pattern.forEach((rowIdx, reelIdx) => {
            const x = paddingX + (reelIdx * reelWidth) + (110 / 2);
            const y = paddingY + (rowIdx * symbolHeight) + (symbolHeight / 2);
            d += (reelIdx === 0 ? "M" : "L") + `${x} ${y}`;
        });

        path.setAttribute('d', d);
        // Set active class if it's within the active paylines count
        const isActive = idx < state.activePaylines;
        path.setAttribute('class', `payline-path line-${idx}${isActive ? ' active' : ''}`);
        path.id = `payline-${idx}`;
        svg.appendChild(path);
    });
}

// Paytable Logic
function openPaytable() {
    const config = MODEL_CONFIGS[state.currentModel];
    elements.paytableTitle.textContent = `${config.name} Payouts`;
    elements.paytableGrid.innerHTML = `
        <div class="paytable-header">
            <span>Symbol</span>
            <span>3x</span>
            <span>4x</span>
            <span>5x</span>
        </div>
    `;
    
    Object.entries(config.payouts).forEach(([sym, mults]) => {
        const item = document.createElement('div');
        item.className = 'paytable-item-row';
        item.innerHTML = `
            <span class="paytable-sym">${sym}</span>
            <span class="paytable-val">${mults[3] > 0 ? 'x' + mults[3] : '-'}</span>
            <span class="paytable-val">${mults[4] > 0 ? 'x' + mults[4] : '-'}</span>
            <span class="paytable-val">${mults[5] > 0 ? 'x' + mults[5] : '-'}</span>
        `;
        elements.paytableGrid.appendChild(item);
    });

    if (config.hasJackpot) {
        const jack = document.createElement('div');
        jack.className = 'paytable-item-row jackpot-row';
        jack.innerHTML = `
            <span class="paytable-sym">💎💎💎💎💎</span>
            <span class="paytable-val" style="grid-column: span 3">1M JACKPOT</span>
        `;
        elements.paytableGrid.appendChild(jack);
    }

    const paylineMapInfo = [1, 3, 5, 7, 9];
    const factor = config.factor || 1;
    const mappingHtml = paylineMapInfo.map((lines) => `
        <div class="mapping-item">
            <span class="map-bet">${lines * factor} tokens</span>
            <span class="map-arrow">→</span>
            <span class="map-lines">${lines} Lines</span>
        </div>
    `).join('');

    const paylineVisual = document.createElement('div');
    paylineVisual.className = 'payline-mapping-container';
    paylineVisual.innerHTML = `
        <h3>Neural Path Scaling</h3>
        <div class="mapping-grid">
            ${mappingHtml}
        </div>
        <p class="mapping-note">Larger bets activate more neural pathways (paylines).</p>
    `;
    elements.paytableGrid.appendChild(paylineVisual);

    elements.paytableModal.classList.remove('hidden');
}

const TRANSLATIONS = {
    en: { title: "AI Token Casino", balance: "Compute Balance", stats: "Performance Stats", logs: "Neural Logs", settings: "Environment Configuration", language: "Language", audio: "Audio Feedback", soundTheme: "Sound Theme", machineColor: "Cabinet Color", mirror: "Mirror Interface", flip: "Flip Interface", close: "Apply & Close", spin: "Spin Model", auto: "Auto-Bet", architecture: "Model Architecture" },
    es: { title: "Casino de Tokens de IA", balance: "Saldo de Cómputo", stats: "Estadísticas de Rendimiento", logs: "Registros Neuronales", settings: "Configuración del Entorno", language: "Idioma", audio: "Audio", soundTheme: "Tema de Sonido", machineColor: "Color del Gabinete", mirror: "Espejar Interfaz", flip: "Voltear Interfaz", close: "Aplicar y Cerrar", spin: "Girar Modelo", auto: "Auto-Apuesta", architecture: "Arquitectura" },
    pt: { title: "Casino de Tokens de IA", balance: "Saldo de Computação", stats: "Estatísticas de Desempenho", logs: "Logs Neurais", settings: "Configuração de Ambiente", language: "Idioma", audio: "Áudio", soundTheme: "Tema de Som", machineColor: "Cor do Gabinete", mirror: "Espelhar Interface", flip: "Inverter Interface", close: "Aplicar e Fechar", spin: "Girar Modelo", auto: "Auto-Aposta", architecture: "Arquitetura" },
    zh: { title: "AI 代币赌场", balance: "计算余额", stats: "性能统计", logs: "神经日志", settings: "环境配置", language: "语言", audio: "音频反馈", soundTheme: "声音主题", machineColor: "机柜颜色", mirror: "镜像界面", flip: "翻转界面", close: "应用并关闭", spin: "旋转模型", auto: "自动投注", architecture: "模型架构" },
    it: { title: "Casinò di Token IA", balance: "Bilancio di Calcolo", stats: "Statistiche Prestazioni", logs: "Log Neurali", settings: "Configurazione Ambiente", language: "Lingua", audio: "Audio", soundTheme: "Tema Sonoro", machineColor: "Colore Cabinet", mirror: "Specchia Interfaccia", flip: "Capovolgi Interfaccia", close: "Applica e Chiudi", spin: "Gira Modello", auto: "Auto-Scommessa", architecture: "Architettura" },
    fr: { title: "Casino de Jetons IA", balance: "Solde de Calcul", stats: "Stats de Performance", logs: "Logs Neuraux", settings: "Configuration de l'Environnement", language: "Langue", audio: "Audio", soundTheme: "Thème Sonore", machineColor: "Couleur du Cabinet", mirror: "Miroir Interface", flip: "Retourner Interface", close: "Appliquer et Fermer", spin: "Lancer Modèle", auto: "Auto-Pari", architecture: "Architecture" },
    ja: { title: "AIトークンカジノ", balance: "計算残高", stats: "パフォーマンス統計", logs: "ニューラルログ", settings: "環境設定", language: "言語", audio: "オーディオ", soundTheme: "サウンドテーマ", machineColor: "キャビネットの色", mirror: "インターフェースをミラーリング", flip: "インターフェースを反転", close: "適用して閉じる", spin: "モデルをスピン", auto: "自動ベット", architecture: "アーキテクチャ" },
    ko: { title: "AI 토큰 카지노", balance: "컴퓨팅 잔액", stats: "성능 통계", logs: "신경 로그", settings: "환경 설정", language: "언어", audio: "오디오 피드백", soundTheme: "사운드 테마", machineColor: "캐비닛 색상", mirror: "인터페이스 미러링", flip: "인터페이스 뒤집기", close: "적용 및 닫기", spin: "모델 스핀", auto: "자동 베팅", architecture: "아키텍처" },
    ar: { title: "كازينو رموز الذكاء الاصطناعي", balance: "رصيد الحساب", stats: "إحصائيات الأداء", logs: "السجلات العصبية", settings: "إعدادات البيئة", language: "اللغة", audio: "الصوت", soundTheme: "سمة الصوت", machineColor: "لون الكابينة", mirror: "مرآة الواجهة", flip: "قلب الواجهة", close: "تطبيق وإغلاق", spin: "تدوير النموذج", auto: "رهان تلقائي", architecture: "هندسة النموذج" },
    hi: { title: "AI टोकन कैसीनो", balance: "कंप्यूट बैलेंस", stats: "प्रदर्शन आँकड़े", logs: "तंत्रिका लॉग", settings: "पर्यावरण विन्यास", language: "भाषा", audio: "ऑडियो फीडबैक", soundTheme: "ध्वनि थीम", machineColor: "कैबिनेट का रंग", mirror: "इंटरफ़ेस मिरर करें", flip: "इंटरफ़ेस पलटें", close: "लागू करें और बंद करें", spin: "मॉडल स्पिन", auto: "ऑटो-बेट", architecture: "मॉडल आर्किटेक्चर" }
};

function updateLanguage() {
    const t = TRANSLATIONS[state.settings.language] || TRANSLATIONS.en;
    document.querySelector('.header-right h1').textContent = t.title;
    document.querySelector('.balance-label').textContent = t.balance;
    document.querySelector('.stats-container h3').textContent = t.stats;
    document.querySelector('.logs-container h3').textContent = t.logs;
    document.getElementById('settings-title').textContent = t.settings;
    document.getElementById('label-language').textContent = t.language;
    document.getElementById('label-audio').textContent = t.audio;
    document.getElementById('label-sound-theme').textContent = t.soundTheme;
    document.getElementById('label-machine-color').textContent = t.machineColor;
    document.getElementById('label-mirror').textContent = t.mirror;
    document.getElementById('label-flip').textContent = t.flip;
    document.getElementById('close-settings').textContent = t.close;
    document.getElementById('spin-btn').textContent = t.spin;
    document.getElementById('auto-btn').textContent = t.auto;
    document.getElementById('paytable-btn').textContent = t.architecture;
}

function updateMachineColor() {
    elements.slotMachine.style.borderColor = state.settings.machineColor;
}

function updateMissionsUI() {
    if (!elements.missionsList) return;
    elements.missionsList.innerHTML = '';
    let completedCount = 0;
    
    MISSIONS.forEach(mission => {
        const progress = state.stats.missionProgress[mission.id];
        const isCompleted = state.stats.completedMissions.includes(mission.id);
        if (isCompleted) completedCount++;
        
        const item = document.createElement('div');
        item.className = `mission-item ${isCompleted ? 'completed' : ''}`;
        
        const percent = Math.min((progress / mission.target) * 100, 100);
        
        item.innerHTML = `
            <div class="mission-header">
                <span>MISSION: ${mission.id.toUpperCase()}</span>
                <span class="mission-reward">+${mission.reward}</span>
            </div>
            <div class="mission-desc">${mission.desc}</div>
            <div class="mission-progress-bar">
                <div class="mission-progress-fill" style="width: ${percent}%"></div>
            </div>
            <div class="mission-status" style="font-size: 0.6rem; margin-top: 4px; text-align: right; color: #666;">
                ${isCompleted ? 'STABILIZED' : `${progress}/${mission.target}`}
            </div>
        `;
        elements.missionsList.appendChild(item);
    });
    
    state.stats.missions = completedCount;
    elements.statMissions.textContent = `${completedCount}/${MISSIONS.length}`;
}

function checkMissionProgress(type, value = 1) {
    MISSIONS.forEach(mission => {
        if (state.stats.completedMissions.includes(mission.id)) return;

        let updated = false;
        if (mission.type === type) {
            if (type === 'symbol') {
                if (mission.symbol === value) {
                    state.stats.missionProgress[mission.id]++;
                    updated = true;
                }
            } else if (type === 'spins' || type === 'streak') {
                state.stats.missionProgress[mission.id] = value;
                updated = true;
            }
        }

        if (updated && state.stats.missionProgress[mission.id] >= mission.target) {
            completeMission(mission);
        }
    });
    updateMissionsUI();
}

function completeMission(mission) {
    if (state.stats.completedMissions.includes(mission.id)) return;
    state.stats.completedMissions.push(mission.id);
    state.tokens += mission.reward;
    addLog(`MISSION ACCOMPLISHED: ${mission.id}. Reward: +${mission.reward} tokens.`, "log-win");
    showFloatingFeedback(`MISSION CLEAR: +${mission.reward}`, 'win');
    playSound(1200, 'triangle', 0.5);
    updateUI();
}

// UI Updates
function updateUI(instant = false) {
    if (instant) {
        displayTokens = state.tokens;
        elements.tokenBalance.textContent = state.tokens.toLocaleString();
    } else {
        animateTokenCount();
    }
    elements.jackpotTicker.textContent = Math.floor(state.jackpot).toLocaleString();
    elements.statSpins.textContent = state.stats.spins;
    elements.statWon.textContent = state.stats.won.toLocaleString();
    
    updateMissionsUI();
    updateLanguage();
    updateMachineColor();
    
    document.body.classList.toggle('mirrored', state.settings.mirrored);
    document.body.classList.toggle('flipped', state.settings.flipped);
    
    drawPaylines();
}

function animateTokenCount() {
    const target = state.tokens;
    if (displayTokens === target) return;
    const duration = 1200;
    const startTime = performance.now();
    const startValue = displayTokens;
    const diff = target - startValue;

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        displayTokens = Math.floor(startValue + (diff * easedProgress));
        elements.tokenBalance.textContent = displayTokens.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(step);
            if (Math.random() > 0.85) playSound(1000 + (progress * 500), 'sine', 0.02);
        } else {
            displayTokens = target;
            elements.tokenBalance.textContent = displayTokens.toLocaleString();
        }
    }
    requestAnimationFrame(step);
}

function showFloatingFeedback(text, type) {
    const div = document.createElement('div');
    div.className = `floating-result ${type === 'win' ? 'log-win' : 'log-loss'}`;
    div.style.color = type === 'win' ? 'var(--primary-color)' : 'var(--accent-color)';
    div.style.textShadow = `0 0 15px ${type === 'win' ? 'var(--primary-color)' : 'var(--accent-color)'}`;
    div.textContent = text;
    elements.winOverlay.appendChild(div);
    setTimeout(() => div.remove(), 1500);
}

// Core Gameplay
function initReels() {
    const symbols = MODEL_CONFIGS[state.currentModel].symbols;
    elements.reels.forEach(reel => {
        reel.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel.appendChild(sym);
        }
    });
}

function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = `[${new Date().toLocaleTimeString()}]`;
    
    const text = document.createElement('span');
    text.className = 'log-msg';
    text.textContent = msg;
    
    entry.appendChild(time);
    entry.appendChild(text);
    
    elements.logs.prepend(entry);
    if (elements.logs.childNodes.length > 50) elements.logs.lastChild.remove();
}

function getRandomLog(category) {
    const logs = MODEL_CONFIGS[state.currentModel].logs[category];
    return logs[Math.floor(Math.random() * logs.length)];
}

async function spin() {
    if (state.isSpinning) return;
    const totalCost = state.currentBet;
    
    if (state.tokens < totalCost || totalCost <= 0) {
        addLog("Inference failed: Credits depleted.", "log-loss");
        state.autoPlay = false;
        elements.autoBtn.classList.remove('active');
        return;
    }

    state.isSpinning = true;
    state.tokens -= totalCost;
    state.jackpot += totalCost * 0.05;
    state.stats.spins++;
    checkMissionProgress('spins', state.stats.spins);
    updateUI();
    playSound(200, 'square', 0.05);
    addLog(getRandomLog('spin'));

    // Clear previous wins
    document.querySelectorAll('.payline-path').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
    elements.slotMachine.classList.remove('big-win-glow');

    const config = MODEL_CONFIGS[state.currentModel];
    
    // Generate 5x3 Result Grid
    const grid = [];
    for (let r = 0; r < 5; r++) {
        const reelResults = [];
        for (let row = 0; row < 3; row++) {
            reelResults.push(config.symbols[Math.floor(Math.random() * config.symbols.length)]);
        }
        grid.push(reelResults);
    }

    const reelPromises = elements.reels.map((reel, i) => {
        return new Promise(resolve => {
            let spinDuration = 1500 + (i * 400);
            if (state.currentModel === 'chatgpt') spinDuration = 600 + (i * 150);
            
            const symbolHeight = 80;
            const resultPosition = 27; // Shift by 27 symbols to show the result
            
            // 1. Capture current symbols to maintain continuity
            const currentSymbols = Array.from(reel.querySelectorAll('.symbol')).map(s => s.textContent).slice(0, 3);
            
            // 2. Rebuild the strip for the animation
            reel.innerHTML = '';
            // Current visible symbols at the top
            for (let j = 0; j < 3; j++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = currentSymbols[j] || config.symbols[0];
                reel.appendChild(sym);
            }
            // Filler symbols in the middle
            for (let j = 3; j < resultPosition; j++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = config.symbols[Math.floor(Math.random() * config.symbols.length)];
                reel.appendChild(sym);
            }
            // The ACTUAL result symbols at the landing position
            for (let j = 0; j < 3; j++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = grid[i][j];
                reel.appendChild(sym);
            }

            // Reset position without animation
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0px)';
            reel.offsetHeight; // Force reflow

            reel.classList.add('spinning');
            
            reel.ontransitionend = () => {
                reel.classList.remove('spinning');
                reel.style.transition = 'none';
                
                // Final cleanup: set the result as the new top symbols
                reel.innerHTML = '';
                for (let j = 0; j < 30; j++) {
                    const sym = document.createElement('div');
                    sym.className = 'symbol';
                    if (j < 3) {
                        sym.textContent = grid[i][j];
                    } else {
                        sym.textContent = config.symbols[Math.floor(Math.random() * config.symbols.length)];
                    }
                    reel.appendChild(sym);
                }
                reel.style.transform = `translateY(0px)`;
                playSound(400 + (i * 100), 'sine', 0.1);
                resolve();
            };

            // Start the spin animation
            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            const totalShift = resultPosition * symbolHeight;
            reel.style.transform = `translateY(-${totalShift}px)`;
        });
    });

    await Promise.all(reelPromises);

    // Track symbol occurrences for missions
    grid.forEach(reel => {
        reel.forEach(symbol => {
            checkMissionProgress('symbol', symbol);
        });
    });

    checkWin(grid);
    state.isSpinning = false;
    if (state.autoPlay) setTimeout(spin, 1500);
}

function checkWin(grid) {
    let totalWin = 0;
    const config = MODEL_CONFIGS[state.currentModel];
    const winningLines = [];
    const betPerLine = state.currentBet / state.activePaylines;

    for (let i = 0; i < state.activePaylines; i++) {
        const pattern = PAYLINE_PATTERNS[i];
        const lineSymbols = pattern.map((rowIdx, reelIdx) => grid[reelIdx][rowIdx]);
        
        let matchCount = 1;
        const firstSym = lineSymbols[0];
        for (let j = 1; j < 5; j++) {
            if (lineSymbols[j] === firstSym) {
                matchCount++;
            } else {
                break;
            }
        }

        if (matchCount >= 3) {
            const symbolPayouts = config.payouts[firstSym];
            if (symbolPayouts && symbolPayouts[matchCount] > 0) {
                const lineWin = symbolPayouts[matchCount] * betPerLine;
                totalWin += lineWin;
                winningLines.push({index: i, count: matchCount, symbol: firstSym});
                
                pattern.forEach((rowIdx, reelIdx) => {
                    if (reelIdx < matchCount) {
                        const symbolEl = elements.reels[reelIdx].querySelectorAll('.symbol')[rowIdx];
                        if (symbolEl) symbolEl.classList.add('win');
                    }
                });
            }
        }
    }

    if (totalWin > 0) {
        state.winStreak++;
        checkMissionProgress('streak', state.winStreak);
        const jackpotWin = winningLines.find(w => w.count === 5 && w.symbol === '💎');
        if (config.hasJackpot && jackpotWin) {
            totalWin += state.jackpot;
            state.jackpot = 1000000;
            elements.slotMachine.classList.add('big-win-glow');
            showFloatingFeedback(`ULTIMATE JACKPOT!!! +${totalWin.toLocaleString()}`, 'win');
        } else {
            showFloatingFeedback(`+${totalWin.toLocaleString()}`, 'win');
        }
        
        winningLines.forEach(w => {
            document.getElementById(`payline-${w.index}`).classList.add('active');
        });

        handleWinUI(totalWin);
    } else {
        state.winStreak = 0;
        checkMissionProgress('streak', 0);
        addLog(getRandomLog('loss'), "log-loss");
        elements.appContainer.classList.add('glitch-flash');
        showFloatingFeedback(`-${state.currentBet.toLocaleString()}`, 'loss');
        setTimeout(() => elements.appContainer.classList.remove('glitch-flash'), 400);
    }

    if (totalWin > 0) {
        state.tokens += totalWin;
        state.stats.won += totalWin;
        state.lossStreak = 0;
    } else {
        state.lossStreak++;
    }

    updateUI();
}

function handleWinUI(winAmount) {
    elements.appContainer.classList.add('win-flash');
    setTimeout(() => elements.appContainer.classList.remove('win-flash'), 1000);
    
    addLog(`${getRandomLog('win')} Received ${winAmount.toLocaleString()} tokens.`, "log-win");
    playSound(800, 'triangle', 0.4);
}

// Event Listeners
elements.spinBtn.addEventListener('click', spin);
elements.autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    elements.autoBtn.classList.toggle('active', state.autoPlay);
    if (state.autoPlay) spin();
});

elements.addTokensBtn.addEventListener('click', () => {
    state.tokens += 1000;
    updateUI();
    addLog("Compute grant authorized: +1,000 credits.", "log-win");
    playSound(600, 'sine', 0.2);
});

elements.modelBtns.forEach(btn => btn.addEventListener('click', () => setModel(btn.dataset.model)));
elements.settingsBtn.addEventListener('click', () => elements.settingsModal.classList.remove('hidden'));
elements.closeSettings.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));
elements.paytableBtn.addEventListener('click', openPaytable);
elements.closePaytable.addEventListener('click', () => elements.paytableModal.classList.add('hidden'));
elements.volumeSlider.addEventListener('input', (e) => state.settings.volume = parseFloat(e.target.value));
elements.languageSelect.addEventListener('change', (e) => {
    state.settings.language = e.target.value;
    updateUI();
});
elements.soundThemeSelect.addEventListener('change', (e) => state.settings.soundTheme = e.target.value);
elements.machineColorPicker.addEventListener('input', (e) => {
    state.settings.machineColor = e.target.value;
    updateMachineColor();
});
elements.mirrorToggle.addEventListener('change', (e) => {
    state.settings.mirrored = e.target.checked;
    updateUI();
});
elements.flipToggle.addEventListener('change', (e) => {
    state.settings.flipped = e.target.checked;
    updateUI();
});

setInterval(() => {
    if (!state.isSpinning && Math.random() > 0.8) addLog(getRandomLog('idle'));
}, 10000);

// Initialize
setModel('gemini');
addLog("Neural connection established. Initializing slot cabinet...");
