/**
 * AI Slot Machine - Game Logic
 * Parodying AI culture for Karen, Gary, Sam, Cathy, and Pete.
 */

// Symbols and Payouts
const SYMBOLS = ['🤖', '🧠', '💎', '⚡', '📉'];
const PAYOUTS = {
    '💎': 100, // Top Model
    '🧠': 20,  // Neural Net
    '🤖': 10,  // LLM Bot
    '⚡': 5,   // High Speed Compute
    '📉': 0    // Hallucination
};

// Game State
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
function playSound(freq, type = 'sine', duration = 0.1) {
    if (state.settings.volume === 0) return;
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
}

// Initialize Reels
function initReels() {
    elements.reels.forEach(reel => {
        reel.innerHTML = '';
        // Add many symbols for spinning effect
        for (let i = 0; i < 20; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reel.appendChild(sym);
        }
    });
}

// Update UI
function updateUI() {
    elements.tokenBalance.textContent = state.tokens.toLocaleString();
    elements.jackpotTicker.textContent = Math.floor(state.jackpot).toLocaleString();
    elements.statSpins.textContent = state.stats.spins;
    elements.statWon.textContent = state.stats.won.toLocaleString();
    elements.statMissions.textContent = `${state.stats.missions}/3`;
}

// Log Message (Gary's logs)
function addLog(msg, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    elements.logs.prepend(entry);
    if (elements.logs.childNodes.length > 50) elements.logs.lastChild.remove();
}

// Spin Logic
async function spin() {
    if (state.isSpinning || state.tokens < state.currentBet) {
        if (state.tokens < state.currentBet) {
            addLog("Insufficient compute credits. Deposit more tokens.", "log-loss");
            state.autoPlay = false;
            elements.autoBtn.classList.remove('active');
        }
        return;
    }

    state.isSpinning = true;
    state.tokens -= state.currentBet;
    state.jackpot += state.currentBet * 0.1; // 10% of bet goes to jackpot (Karen's live jackpot)
    state.stats.spins++;
    updateUI();
    playSound(200, 'square', 0.05);

    addLog(`Running inference... Bet: ${state.currentBet}`);

    const results = [];
    const reelPromises = elements.reels.map((reel, i) => {
        return new Promise(resolve => {
            const spinDuration = 1000 + (i * 500);
            const symbolHeight = reel.querySelector('.symbol').clientHeight;
            const stopIdx = Math.floor(Math.random() * SYMBOLS.length);
            results.push(SYMBOLS[stopIdx]);

            const stopHandler = () => {
                if (state.isSpinning) {
                    reel.style.transitionDuration = '150ms';
                    reel.style.transitionTimingFunction = 'ease-out';
                    addLog(`Manual stop on Reel ${i+1}.`);
                }
            };
            reel.parentElement.addEventListener('click', stopHandler);

            reel.ontransitionend = () => {
                reel.parentElement.removeEventListener('click', stopHandler);
                reel.style.transition = 'none';
                reel.innerHTML = '';
                for (let j = 0; j < 20; j++) {
                    const sym = document.createElement('div');
                    sym.className = 'symbol';
                    sym.textContent = j === 1 ? SYMBOLS[stopIdx] : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    reel.appendChild(sym);
                }
                reel.style.transform = `translateY(-${symbolHeight}px)`;
                playSound(400 + (i * 100), 'sine', 0.1);
                reel.ontransitionend = null;
                resolve();
            };

            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            const totalShift = (20 * symbolHeight) + (stopIdx * symbolHeight);
            reel.style.transform = `translateY(-${totalShift}px)`;
        });
    });

    await Promise.all(reelPromises);
    checkWin(results);
    state.isSpinning = false;

    if (state.autoPlay) {
        setTimeout(spin, 1000);
    }
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
        const basePayout = PAYOUTS[r1];
        winAmount = basePayout * state.currentBet;
        
        // Visual Feedback (Cathy)
        document.querySelector('.payline').classList.add('active');
        elements.reels.forEach(reel => {
            const centerSymbol = reel.querySelectorAll('.symbol')[1];
            if (centerSymbol) centerSymbol.classList.add('win');
        });

        if (r1 === '💎') {
            winAmount += state.jackpot;
            state.jackpot = 100000;
            addLog("SINGULARITY ACHIEVED! JACKPOT!", "log-win");
            document.querySelector('.slot-machine').classList.add('shake');
            setTimeout(() => document.querySelector('.slot-machine').classList.remove('shake'), 1000);
        } else {
            addLog(`Valid alignment: ${r1} x3! Won ${winAmount} tokens.`, "log-win");
        }
    } else {
        addLog("Hallucination detected. No tokens generated.", "log-loss");
    }

    if (winAmount > 0) {
        state.tokens += winAmount;
        state.stats.won += winAmount;
        state.lossStreak = 0;
        playSound(800, 'triangle', 0.3);
        
        // Missions (Gary's missions)
        if (state.stats.missions < 3) {
            if (state.stats.spins >= 10 && state.stats.missions === 0) {
                state.stats.missions = 1;
                addLog("Mission Accomplished: 10 Inferences Run!", "log-win");
            }
            if (winAmount >= 1000 && state.stats.missions === 1) {
                state.stats.missions = 2;
                addLog("Mission Accomplished: High-Yield Model Trained!", "log-win");
            }
        }
    } else {
        state.lossStreak++;
        if (state.lossStreak >= 5 && state.stats.missions === 2) {
            state.stats.missions = 3;
            addLog("Mission Accomplished: Hallucination Researcher (5 losses)!", "log-win");
        }
    }

    setTimeout(() => {
        document.querySelector('.payline').classList.remove('active');
        document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
    }, 2000);

    updateUI();
    saveState();
}

// Persistence
function saveState() {
    localStorage.setItem('ai_slot_state', JSON.stringify({
        tokens: state.tokens,
        stats: state.stats,
        settings: state.settings,
        jackpot: state.jackpot
    }));
}

function loadState() {
    const saved = localStorage.getItem('ai_slot_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        updateUI();
        document.documentElement.setAttribute('data-theme', state.settings.theme);
        elements.themeSelect.value = state.settings.theme;
        elements.volumeSlider.value = state.settings.volume;
    }
}

// Event Listeners
elements.spinBtn.addEventListener('click', spin);

elements.autoBtn.addEventListener('click', () => {
    state.autoPlay = !state.autoPlay;
    elements.autoBtn.classList.toggle('active', state.autoPlay);
    if (state.autoPlay) spin();
});

elements.betBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.betBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentBet = parseInt(btn.dataset.amount);
    });
});

elements.maxBetBtn.addEventListener('click', () => {
    elements.betBtns.forEach(b => b.classList.remove('active'));
    elements.maxBetBtn.classList.add('active');
    state.currentBet = Math.min(state.tokens, 1000); // Karen's high bet
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

// Start
loadState();
initReels();
updateUI();
addLog("Welcome to the AI Token Casino. Connect your GPU to begin.");
