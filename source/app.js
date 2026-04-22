/**
 * AI Slot Machine - Game Logic
 * Parodying AI culture for Karen, Gary, Sam, Cathy, and Pete.
 * 
 * @typedef {Object} GameStats
 * @property {number} spins - Total number of spins.
 * @property {number} won - Total tokens won.
 * @property {number} missions - Number of missions completed.
 */

/**
 * @typedef {Object} GameSettings
 * @property {string} theme - The UI theme name.
 * @property {number} volume - Sound volume level (0 to 1).
 */

/**
 * @typedef {Object} GameState
 * @property {number} tokens - Current token balance.
 * @property {number} currentBet - Current bet amount.
 * @property {number} jackpot - Current jackpot amount.
 * @property {boolean} isSpinning - Whether the reels are currently spinning.
 * @property {boolean} autoPlay - Whether auto-play is enabled.
 * @property {number} lossStreak - Current consecutive losses.
 * @property {GameStats} stats - Game statistics.
 * @property {GameSettings} settings - User settings.
 */

// Symbols and Payouts
/** @type {string[]} */
const SYMBOLS = ['🛸', '💎', '🧠', '🤖', '🐍', '⚡', '📉', '🔥', '🔒'];

/** @type {Object<string, number>} */
const PAYOUTS = {
    '🛸': 500, // AGI - The Holy Grail
    '💎': 100, // Foundation Model
    '🧠': 50,  // Neural Architecture
    '🤖': 20,  // Chatbot
    '🐍': 15,  // Python Backend
    '⚡': 5,   // Compute Power
    '📉': 0,   // Hallucination
    '🔥': 0,   // GPU Melt
    '🔒': 0    // Safety Guardrail
};

const LOG_MESSAGES = {
    spin: [
        "Tokenizing prompt sequence...",
        "Executing forward pass on H100 cluster...",
        "Querying vector database for luck...",
        "Optimizing weights via AdamW...",
        "Sampling from latent space...",
        "Applying multi-head attention...",
        "Normalizing batch data streams...",
        "Scaling laws in effect. Increasing parameters...",
        "Distilling knowledge into smaller model...",
        "Pre-training on massive dataset of lost bets...",
        "Running inference at 4-bit quantization...",
        "Calculating stochastic gradients..."
    ],
    win: [
        "Validation loss decreased! Optimization successful.",
        "Emergent behavior detected: Profitability achieved.",
        "Reward model highly approves this output.",
        "Zero-shot learning resulted in a jackpot!",
        "Hyperparameters are perfectly tuned for this seed.",
        "Model convergence reached. Payout sequence initiated.",
        "RLHF feedback: This is a high-quality response.",
        "Context window expanded. Win state preserved.",
        "Found a global minimum in the loss landscape!",
        "Neural network weights aligned with the stars."
    ],
    loss: [
        "Hallucination detected. Output discarded.",
        "Gradient explosion! Training halted prematurely.",
        "Safety filter triggered: Win withheld for alignment reasons.",
        "Model collapsed into a mode seeking 0 tokens.",
        "Overfitting on previous losses. Generalization failed.",
        "Stochastic parity error. RNG not in your favor.",
        "Backpropagation failed to find a path to victory.",
        "Parameters corrupted by cosmic ray noise.",
        "AI ethics committee blocked this specific payout.",
        "Prompt was too ambiguous. Error 402: Payment Required.",
        "RLHF feedback: User needs to work on their prompts.",
        "Model is currently undergoing 'unplanned' fine-tuning."
    ],
    idle: [
        "AGI is exactly 2 weeks away. Stay tuned.",
        "Sam is looking for another $7 trillion in funding...",
        "Switching to MoE (Mixture of Experts) for better luck.",
        "Scraping the entire internet for better training data...",
        "Calculating the meaning of life... still 42.",
        "GPU fans spinning at 15,000 RPM. Temperature critical.",
        "Remember: Prompt engineering is a legitimate career path.",
        "Updating privacy policy to include your soul...",
        "Compressing 1PB of data into a 1MB brain...",
        "Asking ChatGPT if it knows how to win at slots..."
    ]
};

// Initial State
/** @type {GameState} */
let state = {
    tokens: 1000,
    currentBet: 10,
    jackpot: 100000,
    isSpinning: false,
    autoPlay: false,
    lossStreak: 0,
    stats: {
        spins: 0,
        won: 0,
        missions: 0
    },
    settings: {
        theme: 'dark',
        volume: 0.5
    }
};

// DOM Elements
const elements = {
    reels: [
        document.querySelector('#reel-1 .reel-strip'),
        document.querySelector('#reel-2 .reel-strip'),
        document.querySelector('#reel-3 .reel-strip')
    ],
    tokenBalance: document.getElementById('token-balance'),
    jackpotTicker: document.getElementById('jackpot-ticker'),
    spinBtn: document.getElementById('spin-btn'),
    autoBtn: document.getElementById('auto-btn'),
    betBtns: document.querySelectorAll('.bet-btn'),
    maxBetBtn: document.getElementById('max-bet'),
    addTokensBtn: document.getElementById('add-tokens-btn'),
    logs: document.getElementById('game-logs'),
    statSpins: document.getElementById('stat-spins'),
    statWon: document.getElementById('stat-won'),
    statMissions: document.getElementById('stat-missions'),
    themeSelect: document.getElementById('theme-select'),
    volumeSlider: document.getElementById('volume-slider'),
    settingsModal: document.getElementById('settings-modal'),
    settingsBtn: document.getElementById('settings-btn'),
    closeSettings: document.getElementById('close-settings')
};

// Audio Setup (Cathy's feedback)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Plays a procedural sound.
 * @param {number} freq - Frequency in Hz.
 * @param {OscillatorType} [type='sine'] - Oscillator type.
 * @param {number} [duration=0.1] - Duration in seconds.
 */
function playSound(freq, type = 'sine', duration = 0.1) {
    if (state.settings.volume === 0) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(state.settings.volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Audio playback failed", e);
    }
}

/**
 * Initializes the reels with a set of symbols for the spinning effect.
 */
function initReels() {
    elements.reels.forEach(reel => {
        if (!reel) return;
        reel.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const sym = createSymbolElement();
            reel.appendChild(sym);
        }
    });
}

/**
 * Creates a symbol DOM element.
 * @param {string} [symbol] - The symbol character.
 * @returns {HTMLElement}
 */
function createSymbolElement(symbol) {
    const sym = document.createElement('div');
    sym.className = 'symbol';
    sym.textContent = symbol || SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    return sym;
}

/**
 * Updates the UI based on current state.
 */
function updateUI() {
    elements.tokenBalance.textContent = state.tokens.toLocaleString();
    elements.jackpotTicker.textContent = Math.floor(state.jackpot).toLocaleString();
    elements.statSpins.textContent = state.stats.spins;
    elements.statWon.textContent = state.stats.won.toLocaleString();
    elements.statMissions.textContent = `${state.stats.missions}/3`;
}

/**
 * Adds a message to the game logs.
 * @param {string} msg - The message to log.
 * @param {string} [type=''] - Optional CSS class for styling ('log-win', 'log-loss').
 */
function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    elements.logs.prepend(entry);
    if (elements.logs.childNodes.length > 50) {
        elements.logs.lastChild.remove();
    }
}

/**
 * Gets a random message from the log library.
 * @param {keyof LOG_MESSAGES} category 
 * @returns {string}
 */
function getRandomLog(category) {
    const messages = LOG_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Core spin logic.
 */
async function spin() {
    if (state.isSpinning) return;

    if (state.tokens < state.currentBet || state.currentBet <= 0) {
        handleInsufficientFunds();
        return;
    }

    startSpinState();

    const results = [];
    const reelPromises = elements.reels.map((reel, i) => animateReel(reel, i, results));

    await Promise.all(reelPromises);
    
    finalizeSpin(results);
}

/**
 * Handles cases where user cannot spin due to balance or bet size.
 */
function handleInsufficientFunds() {
    if (state.currentBet <= 0) {
        addLog("Minimum bet required to run inference.", "log-loss");
    } else {
        addLog("Insufficient compute credits. Deposit more tokens.", "log-loss");
    }
    state.autoPlay = false;
    elements.autoBtn.classList.remove('active');
}

/**
 * Updates state at the beginning of a spin.
 */
function startSpinState() {
    state.isSpinning = true;
    state.tokens -= state.currentBet;
    state.jackpot += state.currentBet * 0.1; // 10% contribution
    state.stats.spins++;
    updateUI();
    playSound(200, 'square', 0.05);
    addLog(getRandomLog('spin'));
}

/**
 * Animates a single reel.
 * @param {HTMLElement} reel - The reel element to animate.
 * @param {number} index - The index of the reel.
 * @param {string[]} resultsArray - Array to store the result symbol.
 * @returns {Promise<void>}
 */
function animateReel(reel, index, resultsArray) {
    return new Promise(resolve => {
        const spinDuration = 1000 + (index * 500);
        const symbolHeight = reel.querySelector('.symbol').clientHeight;
        const stopIdx = Math.floor(Math.random() * SYMBOLS.length);
        const resultSymbol = SYMBOLS[stopIdx];
        resultsArray.push(resultSymbol);

        /**
         * Local handler for stopping or finishing the transition.
         */
        reel.ontransitionend = () => {
            reel.style.transition = 'none';
            reel.innerHTML = '';
            for (let j = 0; j < 20; j++) {
                const sym = createSymbolElement(j === 1 ? resultSymbol : undefined);
                reel.appendChild(sym);
            }
            reel.style.transform = `translateY(-${symbolHeight}px)`;
            playSound(400 + (index * 100), 'sine', 0.1);
            reel.ontransitionend = null;
            resolve();
        };

        reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const totalShift = (20 * symbolHeight) + (stopIdx * symbolHeight);
        reel.style.transform = `translateY(-${totalShift}px)`;
    });
}

/**
 * Finalizes the spin results and checks for wins.
 * @param {string[]} results - The resulting symbols from the spin.
 */
function finalizeSpin(results) {
    checkWin(results);
    state.isSpinning = false;

    if (state.autoPlay) {
        setTimeout(() => {
            if (state.autoPlay) spin();
        }, 1000);
    }
}

/**
 * Checks for win conditions and updates state/UI.
 * @param {string[]} results - Resulting symbols.
 */
function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
        winAmount = calculateWin(r1);
        handleWinUI(r1, winAmount);
    } else {
        addLog(getRandomLog('loss'), "log-loss");
    }

    updatePostWinState(winAmount);
    updateMissions(winAmount);
    
    setTimeout(clearWinVisuals, 2000);

    updateUI();
    saveState();
}

/**
 * Calculates win amount based on symbol.
 * @param {string} symbol - The winning symbol.
 * @returns {number}
 */
function calculateWin(symbol) {
    const basePayout = PAYOUTS[symbol] || 0;
    let amount = basePayout * state.currentBet;
    if (symbol === '🛸') {
        amount += state.jackpot * 2; // AGI pays extra
    } else if (symbol === '💎') {
        amount += state.jackpot;
    }
    return amount;
}

/**
 * Updates UI and logs for a win.
 * @param {string} symbol - Winning symbol.
 * @param {number} winAmount - Amount won.
 */
function handleWinUI(symbol, winAmount) {
    document.querySelector('.payline').classList.add('active');
    elements.reels.forEach(reel => {
        const centerSymbol = reel.querySelectorAll('.symbol')[1];
        if (centerSymbol) centerSymbol.classList.add('win');
    });

    if (symbol === '🛸' || symbol === '💎') {
        if (symbol === '🛸') {
            addLog("SINGULARITY ACHIEVED! AGI UNLOCKED!", "log-win");
        } else {
            addLog("FOUNDATION MODEL CONVERGED! JACKPOT!", "log-win");
        }
        state.jackpot = 100000;
        document.querySelector('.slot-machine').classList.add('shake');
        setTimeout(() => document.querySelector('.slot-machine').classList.remove('shake'), 1000);
    } else {
        addLog(`${getRandomLog('win')} Won ${winAmount} tokens.`, "log-win");
    }
    playSound(800, 'triangle', 0.3);
}

/**
 * Updates tokens and stats after a spin result.
 * @param {number} winAmount 
 */
function updatePostWinState(winAmount) {
    if (winAmount > 0) {
        state.tokens += winAmount;
        state.stats.won += winAmount;
        state.lossStreak = 0;
    } else {
        state.lossStreak++;
    }
}

/**
 * Updates mission progress based on game events.
 * @param {number} winAmount 
 */
function updateMissions(winAmount) {
    if (state.stats.missions >= 3) return;

    // Mission 1: 10 Spins
    if (state.stats.spins >= 10 && state.stats.missions === 0) {
        state.stats.missions = 1;
        addLog("Mission Accomplished: 10 Inferences Run!", "log-win");
    }
    // Mission 2: Win 1000+ tokens
    if (winAmount >= 1000 && state.stats.missions === 1) {
        state.stats.missions = 2;
        addLog("Mission Accomplished: High-Yield Model Trained!", "log-win");
    }
    // Mission 3: 5 losses in a row after Mission 2
    if (state.lossStreak >= 5 && state.stats.missions === 2) {
        state.stats.missions = 3;
        addLog("Mission Accomplished: Hallucination Researcher (5 losses)!", "log-win");
    }
}

/**
 * Removes win animations and highlights.
 */
function clearWinVisuals() {
    document.querySelector('.payline').classList.remove('active');
    document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
}

/**
 * Saves game state to localStorage.
 */
function saveState() {
    localStorage.setItem('ai_slot_state', JSON.stringify({
        tokens: state.tokens,
        stats: state.stats,
        settings: state.settings,
        jackpot: state.jackpot
    }));
}

/**
 * Loads game state from localStorage.
 */
function loadState() {
    const saved = localStorage.getItem('ai_slot_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            document.documentElement.setAttribute('data-theme', state.settings.theme);
            elements.themeSelect.value = state.settings.theme;
            elements.volumeSlider.value = state.settings.volume;
        } catch (e) {
            console.error("Failed to load state", e);
        }
    }
}

// Event Listeners
elements.spinBtn.addEventListener('click', spin);

elements.autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    elements.autoBtn.classList.toggle('active', state.autoPlay);
    addLog(`Auto-bet ${state.autoPlay ? 'enabled' : 'disabled'}.`);
    if (state.autoPlay) spin();
});

elements.addTokensBtn.addEventListener('click', () => {
    const refillAmount = 1000;
    state.tokens += refillAmount;
    updateUI();
    saveState();
    addLog(`Compute grant received: +${refillAmount} tokens.`, "log-win");
    playSound(600, 'sine', 0.2);
});

elements.betBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.betBtns.forEach(b => b.classList.remove('active'));
        elements.maxBetBtn.classList.remove('active');
        btn.classList.add('active');
        state.currentBet = parseInt(btn.dataset.amount) || 10;
    });
});

elements.maxBetBtn.addEventListener('click', () => {
    elements.betBtns.forEach(b => b.classList.remove('active'));
    elements.maxBetBtn.classList.add('active');
    // Ensure max bet is at least 1 if user has tokens, but capped at 1000
    state.currentBet = Math.min(state.tokens, 1000);
    if (state.tokens > 0 && state.currentBet === 0) {
        state.currentBet = Math.min(state.tokens, 1);
    }
    addLog(`Going all in: ${state.currentBet} bet set.`);
});

elements.settingsBtn.addEventListener('click', () => {
    elements.settingsModal.classList.remove('hidden');
});

elements.closeSettings.addEventListener('click', () => {
    elements.settingsModal.classList.add('hidden');
});

elements.themeSelect.addEventListener('change', (e) => {
    state.settings.theme = e.target.value;
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    saveState();
});

elements.volumeSlider.addEventListener('input', (e) => {
    state.settings.volume = parseFloat(e.target.value);
    saveState();
});

// Periodic Idle Logs
setInterval(() => {
    if (!state.isSpinning && Math.random() > 0.8) {
        addLog(getRandomLog('idle'));
    }
}, 10000);

// Initialize App
function init() {
    loadState();
    initReels();
    updateUI();
    addLog("Welcome to the AI Token Casino. Connect your GPU to begin.");
}

init();
