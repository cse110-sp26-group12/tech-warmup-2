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
        bets: [1, 2, 5, 10],
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
        bets: [10, 20, 50, 100],
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
        bets: [100, 200, 500, 1000],
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
    currentModel: 'gemini',
    stats: { spins: 0, won: 0, missions: 0 },
    settings: { volume: 0.5 }
};

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
    paylineRange: document.getElementById('payline-range'),
    paylineCount: document.getElementById('payline-count'),
    logs: document.getElementById('game-logs'),
    statSpins: document.getElementById('stat-spins'),
    jackpotHint: document.getElementById('jackpot-hint'),
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
    elements.jackpotHint.classList.toggle('hidden', !config.hasJackpot);
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
        path.setAttribute('class', `payline-path line-${idx}`);
        path.id = `payline-${idx}`;
        svg.appendChild(path);
    });
}

function updatePaylineDisplay() {
    state.activePaylines = parseInt(elements.paylineRange.value);
    elements.paylineCount.textContent = state.activePaylines;
    
    // Highlight active lines briefly
    document.querySelectorAll('.payline-path').forEach((path, idx) => {
        path.classList.toggle('active', idx < state.activePaylines);
    });
    
    setTimeout(() => {
        if (!state.isSpinning) {
            document.querySelectorAll('.payline-path').forEach(path => path.classList.remove('active'));
        }
    }, 1000);
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
    const totalCost = state.currentBet * state.activePaylines;
    
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
    updateUI();
    playSound(200, 'square', 0.05);
    addLog(getRandomLog('spin'));

    // Clear previous wins
    document.querySelectorAll('.payline-path').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));

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
            reel.classList.add('spinning');
            
            reel.ontransitionend = () => {
                reel.classList.remove('spinning');
                reel.style.transition = 'none';
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

            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            const totalShift = (27 * symbolHeight);
            reel.style.transform = `translateY(-${totalShift}px)`;
        });
    });

    await Promise.all(reelPromises);
    checkWin(grid);
    state.isSpinning = false;
    if (state.autoPlay) setTimeout(spin, 1500);
}

function checkWin(grid) {
    let totalWin = 0;
    const config = MODEL_CONFIGS[state.currentModel];
    const winningLines = [];

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
                const lineWin = symbolPayouts[matchCount] * state.currentBet;
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
        addLog(getRandomLog('loss'), "log-loss");
        elements.appContainer.classList.add('glitch-flash');
        showFloatingFeedback(`-${(state.currentBet * state.activePaylines).toLocaleString()}`, 'loss');
        setTimeout(() => elements.appContainer.classList.remove('glitch-flash'), 400);
    }

    if (totalWin > 0) {
        state.tokens += totalWin;
        state.stats.won += totalWin;
        state.lossStreak = 0;
    } else {
        state.lossStreak++;
    }

    setTimeout(() => {
        document.querySelectorAll('.payline-path').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.symbol.win').forEach(s => s.classList.remove('win'));
        elements.slotMachine.classList.remove('big-win-glow');
    }, 2500);

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
elements.paylineRange.addEventListener('input', updatePaylineDisplay);

setInterval(() => {
    if (!state.isSpinning && Math.random() > 0.8) addLog(getRandomLog('idle'));
}, 10000);

// Initialize
setModel('gemini');
addLog("Neural connection established. Initializing slot cabinet...");
