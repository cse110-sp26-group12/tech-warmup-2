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
        payouts: { '🍕': 50, '🍦': 20, '🍔': 10, '🌮': 5, '🍩': 5, '🎈': 2, '🎉': 2, '🎁': 1, '🐶': 1 },
        bets: [1, 2, 5, 10],
        winFrequency: 0.45,
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
        payouts: { '🛸': 500, '💎': 100, '🧠': 50, '🤖': 20, '🐍': 15, '⚡': 5, '📉': 0, '🔥': 0, '🔒': 0 },
        bets: [10, 20, 50, 100],
        winFrequency: 0.25,
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
        payouts: { '💰': 1000, '🎰': 500, '🏦': 200, '💎': 100, '💳': 50, '📊': 0, '📈': 0, '🏢': 0, '⚖️': 0 },
        bets: [100, 200, 500, 1000],
        winFrequency: 0.12,
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
    jackpot: 100000,
    isSpinning: false,
    autoPlay: false,
    lossStreak: 0,
    currentModel: 'gemini',
    stats: { spins: 0, won: 0, missions: 0 },
    settings: { volume: 0.5 }
};

let displayTokens = state.tokens;

// DOM Elements
const elements = {
    appContainer: document.querySelector('.app-container'),
    slotMachine: document.querySelector('.slot-machine'),
    winOverlay: document.getElementById('win-overlay'),
    jackpotDisplay: document.getElementById('jackpot-display'),
    reels: [
        document.querySelector('#reel-1 .reel-strip'),
        document.querySelector('#reel-2 .reel-strip'),
        document.querySelector('#reel-3 .reel-strip')
    ],
    reelContainers: [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ],
    tokenBalance: document.getElementById('token-balance'),
    jackpotTicker: document.getElementById('jackpot-ticker'),
    spinBtn: document.getElementById('spin-btn'),
    autoBtn: document.getElementById('auto-btn'),
    betContainer: document.getElementById('bet-container'),
    addTokensBtn: document.getElementById('add-tokens-btn'),
    logs: document.getElementById('game-logs'),
    statSpins: document.getElementById('stat-spins'),
    statWon: document.getElementById('stat-won'),
    statMissions: document.getElementById('stat-missions'),
    volumeSlider: document.getElementById('volume-slider'),
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
    if (config.hasJackpot) {
        state.jackpot = 1000000; // 1M for Claude
    } else {
        state.jackpot = 100000;
    }
    
    // Update Bet Buttons
    elements.betContainer.innerHTML = '';
    config.bets.forEach(amount => {
        const btn = document.createElement('button');
        btn.className = 'bet-btn';
        if (amount === state.currentBet) btn.classList.add('active');
        btn.textContent = amount;
        btn.onclick = () => {
            document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentBet = amount;
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
        // ALL IN: Bet entire account balance
        state.currentBet = state.tokens > 0 ? state.tokens : config.bets[0];
        addLog(`ALL IN: ${state.currentBet.toLocaleString()} tokens staked!`);
        playSound(1000, 'sine', 0.1);
    };
    elements.betContainer.appendChild(maxBtn);

    if (!config.bets.includes(state.currentBet) && state.currentBet !== state.tokens) {
        state.currentBet = config.bets[0];
        const firstBtn = elements.betContainer.querySelector('.bet-btn');
        if (firstBtn) firstBtn.classList.add('active');
    }

    addLog(`System reconfigured: Loaded ${config.name} model architecture.`);
    initReels();
    updateUI(true);
}

// Paytable Logic
function openPaytable() {
    const config = MODEL_CONFIGS[state.currentModel];
    elements.paytableTitle.textContent = `${config.name} Payouts`;
    elements.paytableGrid.innerHTML = '';
    
    Object.entries(config.payouts).forEach(([sym, mult]) => {
        const item = document.createElement('div');
        item.className = 'paytable-item';
        item.innerHTML = `
            <span class="paytable-sym">${sym}</span>
            <span class="paytable-val">${mult > 0 ? 'x' + mult : 'Hallucination'}</span>
        `;
        elements.paytableGrid.appendChild(item);
    });

    if (config.hasJackpot) {
        const jack = document.createElement('div');
        jack.className = 'paytable-item';
        jack.style.borderTop = '2px solid var(--accent-color)';
        jack.innerHTML = `<span class="paytable-sym">💰💰💰</span><span class="paytable-val">1M JACKPOT</span>`;
        elements.paytableGrid.appendChild(jack);
    }
    elements.paytableModal.classList.remove('hidden');
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
    elements.statMissions.textContent = `${state.stats.missions}/3`;
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
        for (let i = 0; i < 20; i++) {
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
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    elements.logs.prepend(entry);
    if (elements.logs.childNodes.length > 50) elements.logs.lastChild.remove();
}

function getRandomLog(category) {
    const logs = MODEL_CONFIGS[state.currentModel].logs[category];
    return logs[Math.floor(Math.random() * logs.length)];
}

async function spin() {
    if (state.isSpinning) return;
    if (state.tokens < state.currentBet || state.currentBet <= 0) {
        addLog("Inference failed: Credits depleted.", "log-loss");
        state.autoPlay = false;
        elements.autoBtn.classList.remove('active');
        return;
    }

    state.isSpinning = true;
    state.tokens -= state.currentBet;
    state.jackpot += state.currentBet * 0.1;
    state.stats.spins++;
    updateUI();
    playSound(200, 'square', 0.05);
    addLog(getRandomLog('spin'));

    const config = MODEL_CONFIGS[state.currentModel];
    const isWin = Math.random() < config.winFrequency;
    const results = [];
    
    if (isWin) {
        const winSym = config.symbols[Math.floor(Math.random() * 4)];
        results.push(winSym, winSym, winSym);
    } else {
        while (results.length < 3) {
            const s = config.symbols[Math.floor(Math.random() * config.symbols.length)];
            results.push(s);
            if (results.length === 3 && results[0] === results[1] && results[1] === results[2]) {
                results[2] = config.symbols[(config.symbols.indexOf(s) + 1) % config.symbols.length];
            }
        }
    }

    const reelPromises = elements.reels.map((reel, i) => {
        return new Promise(resolve => {
            let spinDuration = 2000 + (i * 600);
            // Faster spinning for ChatGPT model to match Gary's "For-Fun" fast-paced playstyle
            if (state.currentModel === 'chatgpt') {
                spinDuration = 800 + (i * 200);
            }
            const symbolHeight = 80;
            reel.classList.add('spinning');
            
            const stopHandler = () => {
                if (reel.classList.contains('spinning')) {
                    reel.style.transitionDuration = '200ms';
                    playSound(600, 'sine', 0.05);
                }
            };
            elements.reelContainers[i].addEventListener('click', stopHandler);

            reel.ontransitionend = () => {
                reel.classList.remove('spinning');
                reel.style.transition = 'none';
                reel.innerHTML = '';
                for (let j = 0; j < 20; j++) {
                    const sym = document.createElement('div');
                    sym.className = 'symbol';
                    sym.textContent = j === 1 ? results[i] : config.symbols[Math.floor(Math.random() * config.symbols.length)];
                    reel.appendChild(sym);
                }
                reel.style.transform = `translateY(-${symbolHeight}px)`;
                playSound(400 + (i * 100), 'sine', 0.1);
                elements.reelContainers[i].removeEventListener('click', stopHandler);
                resolve();
            };

            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            const stopIdx = config.symbols.indexOf(results[i]);
            const totalShift = (20 * symbolHeight) + (stopIdx * symbolHeight);
            reel.style.transform = `translateY(-${totalShift}px)`;
        });
    });

    await Promise.all(reelPromises);
    checkWin(results);
    state.isSpinning = false;
    if (state.autoPlay) setTimeout(spin, 1500);
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    const config = MODEL_CONFIGS[state.currentModel];

    if (r1 === r2 && r2 === r3) {
        const basePayout = config.payouts[r1] || 0;
        winAmount = basePayout * state.currentBet;
        
        if (config.hasJackpot && (r1 === '💰' || r1 === '🎰')) {
            winAmount += state.jackpot;
            state.jackpot = 1000000;
            elements.slotMachine.classList.add('big-win-glow');
            showFloatingFeedback(`JACKPOT!!! +${winAmount.toLocaleString()}`, 'win');
        } else {
            showFloatingFeedback(`+${winAmount.toLocaleString()} (x${basePayout})`, 'win');
        }
        handleWinUI(r1, winAmount);
    } else {
        addLog(getRandomLog('loss'), "log-loss");
        elements.appContainer.classList.add('glitch-flash');
        showFloatingFeedback(`-${state.currentBet.toLocaleString()}`, 'loss');
        setTimeout(() => elements.appContainer.classList.remove('glitch-flash'), 400);
    }

    if (winAmount > 0) {
        state.tokens += winAmount;
        state.stats.won += winAmount;
        state.lossStreak = 0;
    } else {
        state.lossStreak++;
    }

    setTimeout(() => {
        document.querySelector('.payline').classList.remove('active');
        document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
        elements.slotMachine.classList.remove('big-win-glow');
    }, 2500);

    updateUI();
}

function handleWinUI(symbol, winAmount) {
    elements.appContainer.classList.add('win-flash');
    setTimeout(() => elements.appContainer.classList.remove('win-flash'), 1000);
    document.querySelector('.payline').classList.add('active');
    
    elements.reels.forEach(reel => {
        const centerSymbol = reel.querySelectorAll('.symbol')[1];
        if (centerSymbol) centerSymbol.classList.add('win');
    });

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

setInterval(() => {
    if (!state.isSpinning && Math.random() > 0.8) addLog(getRandomLog('idle'));
}, 10000);

// Initialize
setModel('gemini');
addLog("Neural connection established. Initializing slot cabinet...");
