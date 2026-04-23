/**
 * AI Slot Machine - Game Logic
 * Parodying AI culture for Karen, Gary, Sam, Cathy, and Pete.
 */

/**
 * Static configuration for the AI Slot Machine game.
 * Contains model definitions, missions, paylines, and translations.
 */
const Config = {
    MODELS: {
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
    },
    MISSIONS: [
        { id: 'spins_10', desc: 'Execute 10 model inferences', target: 10, reward: 500, type: 'spins' },
        { id: 'diamonds_15', desc: 'Identify 15 diamond artifacts', target: 15, reward: 1000, type: 'symbol', symbol: '💎' },
        { id: 'win_streak_3', desc: 'Achieve 3 consecutive valid outputs', target: 3, reward: 750, type: 'streak' }
    ],
    PAYLINE_PATTERNS: [
        [1, 1, 1, 1, 1], // 1: Middle
        [0, 0, 0, 0, 0], // 2: Top
        [2, 2, 2, 2, 2], // 3: Bottom
        [0, 1, 2, 1, 0], // 4: V-shape
        [2, 1, 0, 1, 2], // 5: Inverted V
        [0, 0, 1, 2, 2], // 6: Staircase Down
        [2, 2, 1, 0, 0], // 7: Staircase Up
        [1, 0, 1, 2, 1], // 8: Zig-zag
        [1, 2, 1, 0, 1]  // 9: Inverted Zig-zag
    ],
    TRANSLATIONS: {
        en: { title: "AI Token Casino", balance: "Compute Balance", stats: "Performance Stats", logs: "Neural Logs", settings: "Environment Configuration", language: "Language", audio: "Audio Feedback", soundTheme: "Sound Theme", machineColor: "Cabinet Color", mirror: "Mirror Interface", flip: "Flip Interface", close: "Apply & Close", spin: "Spin Model", auto: "Auto-Bet", architecture: "Model Architecture" },
        es: { title: "Casino de Tokens de IA", balance: "Saldo de Cómputo", stats: "Estadísticas de Rendimiento", logs: "Registros Neuronales", settings: "Configuración del Entorno", language: "Idioma", audio: "Audio", soundTheme: "Tema de Sonido", machineColor: "Color del Gabinete", mirror: "Espejar Interfaz", flip: "Voltear Interfaz", close: "Aplicar y Cerrar", spin: "Girar Modelo", auto: "Auto-Apuesta", architecture: "Arquitectura" },
        pt: { title: "Casino de Tokens de IA", balance: "Saldo de Computação", stats: "Estatísticas de Desempenho", logs: "Logs Neurais", settings: "Configuração de Ambiente", language: "Idioma", audio: "Áudio", soundTheme: "Tema de Som", machineColor: "Cor do Gabinete", mirror: "Espelhar Interface", flip: "Inverter Interface", close: "Aplicar e Fechar", spin: "Girar Modelo", auto: "Auto-Aposta", architecture: "Arquitetura" },
        zh: { title: "AI 代币赌场", balance: "计算余额", stats: "性能统计", logs: "神经日志", settings: "环境配置", language: "语言", audio: "音频反馈", soundTheme: "声音主题", machineColor: "机柜颜色", mirror: "镜像界面", flip: "翻转界面", close: "应用并关闭", spin: "旋转模型", auto: "自动投注", architecture: "模型架构" },
        it: { title: "Casinò di Token IA", balance: "Bilancio di Calcolo", stats: "Statistiche Prestazioni", logs: "Log Neurali", settings: "Configurazione Ambiente", language: "Lingua", audio: "Audio", soundTheme: "Tema Sonoro", machineColor: "Colore Cabinet", mirror: "Specchia Interfaccia", flip: "Capovolgi Interfaccia", close: "Applica e Chiudi", spin: "Gira Modello", auto: "Auto-Scommessa", architecture: "Architettura" },
        fr: { title: "Casino de Jetons IA", balance: "Solde de Calcul", stats: "Stats de Performance", logs: "Logs Neuraux", settings: "Configuration de l'Environnement", language: "Langue", audio: "Audio", soundTheme: "Thème Sonore", machineColor: "Couleur du Cabinet", mirror: "Miroir Interface", flip: "Retourner Interface", close: "Appliquer et Fermer", spin: "Lancer Modèle", auto: "Auto-Pari", architecture: "Architecture" },
        ja: { title: "AIトークンカジノ", balance: "計算残高", stats: "パフォーマンス統計", logs: "ニューラルログ", settings: "環境設定", language: "言語", audio: "オーディオ", soundTheme: "サウンドテーマ", machineColor: "キャビネットの色", mirror: "インターフェースをミラーリング", flip: "インターフェースを反转", close: "適用して閉じる", spin: "モデルをスピン", auto: "自動ベット", architecture: "アーキテクチャ" },
        ko: { title: "AI 토큰 카지노", balance: "컴퓨팅 잔액", stats: "성능 통계", logs: "신경 로그", settings: "환경 설정", language: "언어", audio: "오디오 피드백", soundTheme: "사운드 테마", machineColor: "캐비닛 색상", mirror: "인터페이스 미러링", flip: "인터페이스 뒤집기", close: "적용 및 닫기", spin: "모델 스핀", auto: "자동 베팅", architecture: "아키텍처" },
        ar: { title: "كازينو رموز الذكاء الاصطناعي", balance: "رصيد الحساب", stats: "إحصائيات الأداء", logs: "السجلات العصبية", settings: "إعدادات البيئة", language: "اللغة", audio: "الصوت", soundTheme: "سمة الصوت", machineColor: "لون الكابينة", mirror: "مرآة الواجهة", flip: "قلب الواجهة", close: "تطبيق وإغلاق", spin: "تدوير النموذج", auto: "رهان تلقائي", architecture: "هندسة النموذج" },
        hi: { title: "AI टोकन कैसीनो", balance: "कंप्यूट बैलेंस", stats: "प्रदर्शन आँकड़े", logs: "तंत्रिका लॉग", settings: "पर्यावरण विन्यास", language: "भाषा", audio: "ऑडियो फीडबैक", soundTheme: "ध्वनि थीम", machineColor: "कैबिनेट का रंग", mirror: "इंटरफ़ेस मिरर करें", flip: "इंटरफ़ेस पलटें", close: "लागू करें और बंद करें", spin: "मॉडल स्पिन", auto: "ऑटो-बेट", architecture: "मॉडल आर्कि테क्चर" }
    }
};

/**
 * Manages the current state of the game, including tokens, bets, and stats.
 */
class GameState {
    constructor() {
        /** @type {number} Total compute balance */
        this.tokens = 1000;
        /** @type {number} Current total bet amount */
        this.currentBet = 10;
        /** @type {number} Number of active paylines */
        this.activePaylines = 1;
        /** @type {number} Current jackpot value */
        this.jackpot = 100000;
        /** @type {boolean} Whether the reels are currently spinning */
        this.isSpinning = false;
        /** @type {boolean} Whether auto-bet mode is active */
        this.autoPlay = false;
        this.lossStreak = 0;
        this.winStreak = 0;
        /** @type {string} ID of the currently active model */
        this.currentModel = 'gemini';
        this.stats = { 
            spins: 0, 
            won: 0, 
            missions: 0,
            missionProgress: {
                spins_10: 0,
                diamonds_15: 0,
                win_streak_3: 0
            },
            completedMissions: []
        };
        this.settings = { 
            volume: 0.5,
            language: 'en',
            soundTheme: 'ai',
            machineColor: '#2a2a2a',
            mirrored: false,
            flipped: false
        };
    }

    /**
     * Updates the token balance.
     * @param {number} amount - The amount to add (negative to subtract).
     */
    updateTokens(amount) {
        this.tokens += amount;
    }

    resetWinStreak() {
        this.winStreak = 0;
    }

    incrementWinStreak() {
        this.winStreak++;
        return this.winStreak;
    }
}

/**
 * Handles all audio playback using the Web Audio API.
 */
class AudioManager {
    constructor(state) {
        this.state = state;
        this.audioCtx = null;
    }

    /**
     * Lazy-initializes the AudioContext on user interaction.
     */
    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /**
     * Plays a synthesized sound based on frequency and type.
     * @param {number} freq - Base frequency in Hz.
     * @param {string} [type='sine'] - Oscillator type.
     * @param {number} [duration=0.1] - Duration in seconds.
     */
    playSound(freq, type = 'sine', duration = 0.1) {
        if (this.state.settings.volume === 0) return;
        this.init();

        let actualFreq = freq;
        let actualType = type;
        let actualDuration = duration;

        const theme = this.state.settings.soundTheme;
        if (theme === 'classic') {
            actualType = 'square';
            actualFreq = freq * 0.8;
            actualDuration = duration * 1.5;
        } else if (theme === 'modern') {
            actualType = 'sawtooth';
            actualFreq = freq * 1.2;
        }

        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = actualType;
            osc.frequency.setValueAtTime(actualFreq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(this.state.settings.volume, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + actualDuration);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + actualDuration);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }
}

/**
 * Tracks and manages in-game missions and objectives.
 */
class MissionManager {
    constructor(state, ui, audio) {
        this.state = state;
        this.ui = ui;
        this.audio = audio;
    }

    /**
     * Updates progress for missions based on a specific event type.
     * @param {string} type - Mission type (e.g., 'spins', 'symbol', 'streak').
     * @param {any} [value=1] - Value associated with the progress update.
     */
    checkProgress(type, value = 1) {
        Config.MISSIONS.forEach(mission => {
            if (this.state.stats.completedMissions.includes(mission.id)) return;

            let updated = false;
            if (mission.type === type) {
                if (type === 'symbol') {
                    if (mission.symbol === value) {
                        this.state.stats.missionProgress[mission.id]++;
                        updated = true;
                    }
                } else if (type === 'spins' || type === 'streak') {
                    this.state.stats.missionProgress[mission.id] = value;
                    updated = true;
                }
            }

            if (updated && this.state.stats.missionProgress[mission.id] >= mission.target) {
                this.completeMission(mission);
            }
        });
        this.ui.updateMissionsUI();
    }

    /**
     * Marks a mission as completed and grants rewards.
     * @param {Object} mission - The mission object from Config.
     */
    completeMission(mission) {
        if (this.state.stats.completedMissions.includes(mission.id)) return;
        this.state.stats.completedMissions.push(mission.id);
        this.state.tokens += mission.reward;
        
        this.ui.addLog(`MISSION ACCOMPLISHED: ${mission.id}. Reward: +${mission.reward} tokens.`, "log-win");
        this.ui.showFloatingFeedback(`MISSION CLEAR: +${mission.reward}`, 'win');
        this.audio.playSound(1200, 'triangle', 0.5);
        this.ui.updateUI();
    }
}

/**
 * Logic for calculating payouts based on reel results and active paylines.
 */
class PayoutEngine {
    constructor(state) {
        this.state = state;
    }

    /**
     * Checks the grid for winning patterns.
     * @param {string[][]} grid - 5x3 grid of symbols.
     * @returns {Object} Total win amount and list of winning line details.
     */
    calculateWin(grid) {
        let totalWin = 0;
        const config = Config.MODELS[this.state.currentModel];
        const winningLines = [];
        const betPerLine = this.state.currentBet / this.state.activePaylines;

        for (let i = 0; i < this.state.activePaylines; i++) {
            const pattern = Config.PAYLINE_PATTERNS[i];
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
                    winningLines.push({
                        index: i, 
                        count: matchCount, 
                        symbol: firstSym,
                        pattern: pattern
                    });
                }
            }
        }

        return { totalWin, winningLines };
    }
}

/**
 * Handles all DOM manipulation, UI updates, and visual feedback.
 */
class UIManager {
    constructor(state, audio) {
        this.state = state;
        this.audio = audio;
        this.displayTokens = state.tokens;
        this.elements = this.cacheElements();
    }

    /**
     * Caches DOM elements for efficient access.
     */
    cacheElements() {
        return {
            appContainer: document.querySelector('.app-container'),
            slotMachine: document.querySelector('.slot-machine'),
            winOverlay: document.getElementById('win-overlay'),
            jackpotDisplay: document.getElementById('jackpot-display'),
            paylinesLayer: document.getElementById('paylines-layer'),
            reels: [1, 2, 3, 4, 5].map(i => document.querySelector(`#reel-${i} .reel-strip`)),
            reelContainers: [1, 2, 3, 4, 5].map(i => document.getElementById(`reel-${i}`)),
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
    }

    /**
     * Updates the entire UI to match the current state.
     * @param {boolean} [instant=false] - If true, skips animations.
     */
    updateUI(instant = false) {
        if (instant) {
            this.displayTokens = this.state.tokens;
            this.elements.tokenBalance.textContent = this.state.tokens.toLocaleString();
        } else {
            this.animateTokenCount();
        }
        this.elements.jackpotTicker.textContent = Math.floor(this.state.jackpot).toLocaleString();
        this.elements.statSpins.textContent = this.state.stats.spins;
        this.elements.statWon.textContent = this.state.stats.won.toLocaleString();
        
        this.updateMissionsUI();
        this.updateLanguage();
        this.updateMachineColor();
        
        document.body.classList.toggle('mirrored', this.state.settings.mirrored);
        document.body.classList.toggle('flipped', this.state.settings.flipped);
        
        this.drawPaylines();
    }

    /**
     * Animates the token balance counter.
     */
    animateTokenCount() {
        const target = this.state.tokens;
        if (this.displayTokens === target) return;
        const duration = 1200;
        const startTime = performance.now();
        const startValue = this.displayTokens;
        const diff = target - startValue;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            this.displayTokens = Math.floor(startValue + (diff * easedProgress));
            this.elements.tokenBalance.textContent = this.displayTokens.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
                if (Math.random() > 0.85) this.audio.playSound(1000 + (progress * 500), 'sine', 0.02);
            } else {
                this.displayTokens = target;
                this.elements.tokenBalance.textContent = this.displayTokens.toLocaleString();
            }
        };
        requestAnimationFrame(step);
    }

    /**
     * Refreshes the mission progress list.
     */
    updateMissionsUI() {
        if (!this.elements.missionsList) return;
        this.elements.missionsList.innerHTML = '';
        let completedCount = 0;
        
        Config.MISSIONS.forEach(mission => {
            const progress = this.state.stats.missionProgress[mission.id];
            const isCompleted = this.state.stats.completedMissions.includes(mission.id);
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
            this.elements.missionsList.appendChild(item);
        });
        
        this.state.stats.missions = completedCount;
        this.elements.statMissions.textContent = `${completedCount}/${Config.MISSIONS.length}`;
    }

    /**
     * Updates text content based on the selected language.
     */
    updateLanguage() {
        const t = Config.TRANSLATIONS[this.state.settings.language] || Config.TRANSLATIONS.en;
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

    updateMachineColor() {
        this.elements.slotMachine.style.borderColor = this.state.settings.machineColor;
    }

    /**
     * Adds a message to the game log sidebar.
     * @param {string} msg - The message text.
     * @param {string} [type=''] - Optional CSS class for styling.
     */
    addLog(msg, type = '') {
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
        
        this.elements.logs.prepend(entry);
        if (this.elements.logs.childNodes.length > 50) this.elements.logs.lastChild.remove();
    }

    /**
     * Displays temporary floating text for wins or losses.
     */
    showFloatingFeedback(text, type) {
        const div = document.createElement('div');
        div.className = `floating-result ${type === 'win' ? 'log-win' : 'log-loss'}`;
        div.style.color = type === 'win' ? 'var(--primary-color)' : 'var(--accent-color)';
        div.style.textShadow = `0 0 15px ${type === 'win' ? 'var(--primary-color)' : 'var(--accent-color)'}`;
        div.textContent = text;
        this.elements.winOverlay.appendChild(div);
        setTimeout(() => div.remove(), 1500);
    }

    /**
     * Renders the SVG paylines overlaying the reels.
     */
    drawPaylines() {
        const container = this.elements.paylinesLayer;
        let svg = container.querySelector('svg');
        if (!svg) {
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('class', 'payline-svg');
            container.appendChild(svg);
        }
        svg.innerHTML = '';

        const reelWidth = 110 + 8;
        const symbolHeight = 80;
        const paddingX = 25;
        const paddingY = 25;

        Config.PAYLINE_PATTERNS.forEach((pattern, idx) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let d = "";
            
            pattern.forEach((rowIdx, reelIdx) => {
                const x = paddingX + (reelIdx * reelWidth) + (110 / 2);
                const y = paddingY + (rowIdx * symbolHeight) + (symbolHeight / 2);
                d += (reelIdx === 0 ? "M" : "L") + `${x} ${y}`;
            });

            path.setAttribute('d', d);
            const isActive = idx < this.state.activePaylines;
            path.setAttribute('class', `payline-path line-${idx}${isActive ? ' active' : ''}`);
            path.id = `payline-${idx}`;
            svg.appendChild(path);
        });
    }

    /**
     * Opens the model payout structure modal.
     */
    openPaytable() {
        const config = Config.MODELS[this.state.currentModel];
        this.elements.paytableTitle.textContent = `${config.name} Payouts`;
        this.elements.paytableGrid.innerHTML = `
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
            this.elements.paytableGrid.appendChild(item);
        });

        if (config.hasJackpot) {
            const jack = document.createElement('div');
            jack.className = 'paytable-item-row jackpot-row';
            jack.innerHTML = `
                <span class="paytable-sym">💎💎💎💎💎</span>
                <span class="paytable-val" style="grid-column: span 3">1M JACKPOT</span>
            `;
            this.elements.paytableGrid.appendChild(jack);
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
            <div class="mapping-grid">${mappingHtml}</div>
            <p class="mapping-note">Larger bets activate more neural pathways (paylines).</p>
        `;
        this.elements.paytableGrid.appendChild(paylineVisual);
        this.elements.paytableModal.classList.remove('hidden');
    }
}

/**
 * Manages the mechanical/visual aspects of the slot reels.
 */
class SlotMachine {
    constructor(state, ui, audio) {
        this.state = state;
        this.ui = ui;
        this.audio = audio;
    }

    /**
     * Populates reels with initial random symbols.
     */
    initReels() {
        const symbols = Config.MODELS[this.state.currentModel].symbols;
        this.ui.elements.reels.forEach(reel => {
            reel.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                reel.appendChild(sym);
            }
        });
    }

    /**
     * Executes the spinning animation and returns the result grid.
     * @returns {Promise<string[][]>} The final grid of symbols.
     */
    async spin() {
        const config = Config.MODELS[this.state.currentModel];
        const grid = this.generateResultGrid(config);
        
        const reelPromises = this.ui.elements.reels.map((reel, i) => {
            return new Promise(resolve => {
                let spinDuration = 1500 + (i * 400);
                if (this.state.currentModel === 'chatgpt') spinDuration = 600 + (i * 150);
                
                const symbolHeight = 80;
                const resultPosition = 27;
                
                const currentSymbols = Array.from(reel.querySelectorAll('.symbol')).map(s => s.textContent).slice(0, 3);
                
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

                reel.style.transition = 'none';
                reel.style.transform = 'translateY(0px)';
                reel.offsetHeight;

                reel.classList.add('spinning');
                
                reel.ontransitionend = () => {
                    reel.classList.remove('spinning');
                    reel.style.transition = 'none';
                    reel.innerHTML = '';
                    for (let j = 0; j < 30; j++) {
                        const sym = document.createElement('div');
                        sym.className = 'symbol';
                        sym.textContent = j < 3 ? grid[i][j] : config.symbols[Math.floor(Math.random() * config.symbols.length)];
                        reel.appendChild(sym);
                    }
                    reel.style.transform = `translateY(0px)`;
                    this.audio.playSound(400 + (i * 100), 'sine', 0.1);
                    resolve();
                };

                reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                const totalShift = resultPosition * symbolHeight;
                reel.style.transform = `translateY(-${totalShift}px)`;
            });
        });

        await Promise.all(reelPromises);
        return grid;
    }

    /**
     * Randomly generates the final symbol grid for a spin.
     */
    generateResultGrid(config) {
        const grid = [];
        for (let r = 0; r < 5; r++) {
            const reelResults = [];
            for (let row = 0; row < 3; row++) {
                reelResults.push(config.symbols[Math.floor(Math.random() * config.symbols.length)]);
            }
            grid.push(reelResults);
        }
        return grid;
    }

    /**
     * Highlights the winning symbols on the reels.
     */
    highlightWins(winningLines) {
        winningLines.forEach(w => {
            const path = document.getElementById(`payline-${w.index}`);
            if (path) path.classList.add('active');
            
            w.pattern.forEach((rowIdx, reelIdx) => {
                if (reelIdx < w.count) {
                    const symbolEl = this.ui.elements.reels[reelIdx].querySelectorAll('.symbol')[rowIdx];
                    if (symbolEl) symbolEl.classList.add('win');
                }
            });
        });
    }
}

/**
 * Main application orchestrator.
 */
class App {
    constructor() {
        this.state = new GameState();
        this.audio = new AudioManager(this.state);
        this.ui = new UIManager(this.state, this.audio);
        this.missions = new MissionManager(this.state, this.ui, this.audio);
        this.payouts = new PayoutEngine(this.state);
        this.slot = new SlotMachine(this.state, this.ui, this.audio);

        this.init();
    }

    /**
     * Initializes the game.
     */
    init() {
        this.setModel('gemini');
        this.setupEventListeners();
        this.ui.addLog("Neural connection established. Initializing slot cabinet...");
        
        setInterval(() => {
            if (!this.state.isSpinning && Math.random() > 0.8) {
                this.ui.addLog(this.getRandomLog('idle'));
            }
        }, 10000);
    }

    /**
     * Attaches DOM event listeners.
     */
    setupEventListeners() {
        this.ui.elements.spinBtn.addEventListener('click', () => this.handleSpin());
        this.ui.elements.autoBtn.addEventListener('click', () => {
            this.state.autoPlay = !this.state.autoPlay;
            this.ui.elements.autoBtn.classList.toggle('active', this.state.autoPlay);
            if (this.state.autoPlay) this.handleSpin();
        });

        this.ui.elements.addTokensBtn.addEventListener('click', () => {
            this.state.tokens += 1000;
            this.ui.updateUI();
            this.ui.addLog("Compute grant authorized: +1,000 credits.", "log-win");
            this.audio.playSound(600, 'sine', 0.2);
        });

        this.ui.elements.modelBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setModel(btn.dataset.model));
        });

        this.ui.elements.settingsBtn.addEventListener('click', () => this.ui.elements.settingsModal.classList.remove('hidden'));
        this.ui.elements.closeSettings.addEventListener('click', () => this.ui.elements.settingsModal.classList.add('hidden'));
        this.ui.elements.paytableBtn.addEventListener('click', () => this.ui.openPaytable());
        this.ui.elements.closePaytable.addEventListener('click', () => this.ui.elements.paytableModal.classList.add('hidden'));
        
        this.ui.elements.volumeSlider.addEventListener('input', (e) => this.state.settings.volume = parseFloat(e.target.value));
        this.ui.elements.languageSelect.addEventListener('change', (e) => {
            this.state.settings.language = e.target.value;
            this.ui.updateUI();
        });
        this.ui.elements.soundThemeSelect.addEventListener('change', (e) => this.state.settings.soundTheme = e.target.value);
        this.ui.elements.machineColorPicker.addEventListener('input', (e) => {
            this.state.settings.machineColor = e.target.value;
            this.ui.updateMachineColor();
        });
        this.ui.elements.mirrorToggle.addEventListener('change', (e) => {
            this.state.settings.mirrored = e.target.checked;
            this.ui.updateUI();
        });
        this.ui.elements.flipToggle.addEventListener('change', (e) => {
            this.state.settings.flipped = e.target.checked;
            this.ui.updateUI();
        });
    }

    /**
     * Switches the active AI model architecture.
     * @param {string} modelId - The ID of the model to load.
     */
    setModel(modelId) {
        this.state.currentModel = modelId;
        const config = Config.MODELS[modelId];
        
        document.body.setAttribute('data-model', modelId);
        this.ui.elements.modelBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.model === modelId));
        
        this.ui.elements.jackpotDisplay.classList.toggle('hidden', !config.hasJackpot);
        this.ui.elements.jackpotHint.classList.toggle('hidden', !config.hasJackpot);
        this.state.jackpot = config.hasJackpot ? 1000000 : 100000;
        
        this.renderBetButtons(config);
        
        this.ui.addLog(`System reconfigured: Loaded ${config.name} model architecture.`);
        this.slot.initReels();
        this.ui.updateUI(true);
    }

    /**
     * Dynamically generates bet selection buttons.
     */
    renderBetButtons(config) {
        const container = this.ui.elements.betContainer;
        container.innerHTML = '';
        const paylineMap = [1, 3, 5, 7, 9];
        const factor = config.factor || 1;
        
        paylineMap.forEach((lines) => {
            const amount = lines * factor;
            const btn = document.createElement('button');
            btn.className = 'bet-btn';
            if (amount === this.state.currentBet && lines === this.state.activePaylines) btn.classList.add('active');
            btn.textContent = amount;
            btn.onclick = () => {
                document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentBet = amount;
                this.state.activePaylines = lines;
                this.ui.updateUI();
                this.audio.playSound(800, 'sine', 0.05);
            };
            container.appendChild(btn);
        });
        
        const maxBtn = document.createElement('button');
        maxBtn.className = 'bet-btn';
        maxBtn.id = 'max-bet';
        maxBtn.textContent = 'MAX';
        maxBtn.onclick = () => {
            document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
            maxBtn.classList.add('active');
            
            if (this.state.tokens >= 9 * factor) this.state.activePaylines = 9;
            else if (this.state.tokens >= 7 * factor) this.state.activePaylines = 7;
            else if (this.state.tokens >= 5 * factor) this.state.activePaylines = 5;
            else if (this.state.tokens >= 3 * factor) this.state.activePaylines = 3;
            else this.state.activePaylines = 1;
            
            this.state.currentBet = this.state.activePaylines * factor;
            
            this.ui.addLog(`ALL IN: ${factor.toLocaleString()} per line on ${this.state.activePaylines} lines!`);
            this.ui.updateUI();
            this.audio.playSound(1000, 'sine', 0.1);
        };
        container.appendChild(maxBtn);

        if (!paylineMap.includes(this.state.activePaylines) || (this.state.activePaylines * factor) !== this.state.currentBet) {
            this.state.activePaylines = paylineMap[0];
            this.state.currentBet = paylineMap[0] * factor;
        }
    }

    /**
     * Orchestrates the spin sequence: cost calculation, animation, and result processing.
     */
    async handleSpin() {
        if (this.state.isSpinning) return;
        const totalCost = this.state.currentBet;
        
        if (this.state.tokens < totalCost || totalCost <= 0) {
            this.ui.addLog("Inference failed: Credits depleted.", "log-loss");
            this.state.autoPlay = false;
            this.ui.elements.autoBtn.classList.remove('active');
            return;
        }

        this.state.isSpinning = true;
        this.state.tokens -= totalCost;
        this.state.jackpot += totalCost * 0.05;
        this.state.stats.spins++;
        this.missions.checkProgress('spins', this.state.stats.spins);
        
        this.ui.updateUI();
        this.audio.playSound(200, 'square', 0.05);
        this.ui.addLog(this.getRandomLog('spin'));

        // Reset UI for new spin
        document.querySelectorAll('.payline-path').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
        this.ui.elements.slotMachine.classList.remove('big-win-glow');

        const grid = await this.slot.spin();

        // Track symbols for missions
        grid.flat().forEach(symbol => this.missions.checkProgress('symbol', symbol));

        this.processResults(grid);
        
        this.state.isSpinning = false;
        if (this.state.autoPlay) setTimeout(() => this.handleSpin(), 1500);
    }

    /**
     * Processes spin results, calculates payouts, and updates streaks.
     */
    processResults(grid) {
        const { totalWin, winningLines } = this.payouts.calculateWin(grid);
        const config = Config.MODELS[this.state.currentModel];

        if (totalWin > 0) {
            this.state.winStreak++;
            this.missions.checkProgress('streak', this.state.winStreak);
            
            let finalWin = totalWin;
            const jackpotWin = winningLines.find(w => w.count === 5 && w.symbol === '💎');
            if (config.hasJackpot && jackpotWin) {
                finalWin += this.state.jackpot;
                this.state.jackpot = 1000000;
                this.ui.elements.slotMachine.classList.add('big-win-glow');
                this.ui.showFloatingFeedback(`ULTIMATE JACKPOT!!! +${finalWin.toLocaleString()}`, 'win');
            } else {
                this.ui.showFloatingFeedback(`+${finalWin.toLocaleString()}`, 'win');
            }
            
            this.slot.highlightWins(winningLines);
            this.handleWinUI(finalWin);
            
            this.state.tokens += finalWin;
            this.state.stats.won += finalWin;
            this.state.lossStreak = 0;
        } else {
            this.state.winStreak = 0;
            this.missions.checkProgress('streak', 0);
            this.ui.addLog(this.getRandomLog('loss'), "log-loss");
            this.ui.elements.appContainer.classList.add('glitch-flash');
            this.ui.showFloatingFeedback(`-${this.state.currentBet.toLocaleString()}`, 'loss');
            setTimeout(() => this.ui.elements.appContainer.classList.remove('glitch-flash'), 400);
            this.state.lossStreak++;
        }

        this.ui.updateUI();
    }

    handleWinUI(winAmount) {
        this.ui.elements.appContainer.classList.add('win-flash');
        setTimeout(() => this.ui.elements.appContainer.classList.remove('win-flash'), 1000);
        this.ui.addLog(`${this.getRandomLog('win')} Received ${winAmount.toLocaleString()} tokens.`, "log-win");
        this.audio.playSound(800, 'triangle', 0.4);
    }

    /**
     * Returns a random personality log for the current model.
     */
    getRandomLog(category) {
        const logs = Config.MODELS[this.state.currentModel].logs[category];
        return logs[Math.floor(Math.random() * logs.length)];
    }
}

// Start the Application
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new App();
});
