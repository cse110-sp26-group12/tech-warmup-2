/**
 * PokéSlots - Vanilla JavaScript Slot Machine
 */

const SYMBOLS = [
    { char: '🐭', name: 'Pikachu', value: 10, weight: 5 },
    { char: '🔥', name: 'Charmander', value: 5, weight: 10 },
    { char: '💧', name: 'Squirtle', value: 5, weight: 10 },
    { char: '🍃', name: 'Bulbasaur', value: 5, weight: 10 },
    { char: '🥚', name: 'Magikarp', value: 2, weight: 20 },
    { char: '👑', name: 'Mewtwo', value: 100, weight: 1 },
];

class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq, type, duration, volume = 0.1) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSpin() {
        this.playTone(150, 'square', 0.1, 0.05);
    }

    playStop() {
        this.playTone(200, 'square', 0.2, 0.1);
    }

    playWin() {
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'square', 0.4, 0.1), i * 150);
        });
    }

    playJackpot() {
        for(let i=0; i<10; i++) {
            setTimeout(() => this.playWin(), i * 500);
        }
    }
}

class PokeSlots {
    constructor() {
        this.sound = new SoundManager();
        this.balance = 1000;
        this.currentBet = 10;
        this.jackpot = 1000000;
        this.isSpinning = false;
        this.autoplay = false;
        this.volatility = 'low'; // low or high
        this.reels = [null, null, null];
        this.reelStates = ['idle', 'idle', 'idle']; // idle, spinning, stopping
        this.results = [0, 0, 0];
        
        // Stats
        this.stats = {
            spins: 0,
            wins: 0,
            streak: 0
        };

        this.initDOM();
        this.initEventListeners();
        this.generateReelStrips();
    }

    initDOM() {
        this.el = {
            jackpot: document.getElementById('jackpot-value'),
            balance: document.getElementById('balance-value'),
            bet: document.getElementById('current-bet'),
            spinBtn: document.getElementById('spin-btn'),
            autoplayBtn: document.getElementById('autoplay-btn'),
            status: document.getElementById('status-message'),
            reelStrips: [
                document.querySelector('#reel-1 .reel-strip'),
                document.querySelector('#reel-2 .reel-strip'),
                document.querySelector('#reel-3 .reel-strip')
            ],
            stopBtns: document.querySelectorAll('.stop-btn'),
            statSpins: document.getElementById('stat-spins'),
            statWins: document.getElementById('stat-wins'),
            statStreak: document.getElementById('stat-streak'),
            eventLog: document.getElementById('event-log'),
            settingsModal: document.getElementById('settings-modal'),
            volatilitySelect: document.getElementById('volatility-select'),
            themeSelect: document.getElementById('theme-select')
        };
    }

    initEventListeners() {
        document.getElementById('spin-btn').addEventListener('click', () => this.startSpin());
        document.getElementById('autoplay-btn').addEventListener('click', () => this.toggleAutoplay());
        document.getElementById('bet-plus').addEventListener('click', () => this.adjustBet(10));
        document.getElementById('bet-minus').addEventListener('click', () => this.adjustBet(-10));
        document.getElementById('bet-max').addEventListener('click', () => this.setMaxBet());
        
        document.querySelectorAll('.stop-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reelIdx = parseInt(e.target.dataset.reel);
                this.stopReel(reelIdx);
            });
        });

        document.getElementById('settings-toggle').addEventListener('click', () => {
            this.el.settingsModal.classList.remove('hidden');
        });

        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.sound.enabled = e.target.checked;
        });

        this.el.volatilitySelect.addEventListener('change', (e) => {
            this.volatility = e.target.value;
            this.log(`Volatility set to ${this.volatility.toUpperCase()}`);
        });

        this.el.themeSelect.addEventListener('change', (e) => {
            document.body.className = e.target.value;
        });
    }

    generateReelStrips() {
        this.el.reelStrips.forEach((strip, idx) => {
            strip.innerHTML = '';
            // Create a long strip of symbols for animation
            // We'll create 50 symbols for a good scroll effect
            for (let i = 0; i < 50; i++) {
                const symbol = this.getRandomSymbol();
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = symbol.char;
                strip.appendChild(div);
            }
        });
    }

    getRandomSymbol() {
        const weightedList = [];
        SYMBOLS.forEach(s => {
            // Adjust weight based on volatility
            let weight = s.weight;
            if (this.volatility === 'high') {
                if (s.name === 'Mewtwo') weight = 1; // Keep jackpot rare
                else if (s.value > 5) weight = 2; // Rare big wins
                else weight = 30; // Mostly common
            }
            for (let i = 0; i < weight; i++) weightedList.push(s);
        });
        return weightedList[Math.floor(Math.random() * weightedList.length)];
    }

    adjustBet(amount) {
        if (this.isSpinning) return;
        const newBet = this.currentBet + amount;
        if (newBet >= 10 && newBet <= this.balance) {
            this.currentBet = newBet;
            this.updateUI();
        }
    }

    setMaxBet() {
        if (this.isSpinning) return;
        this.currentBet = Math.min(this.balance, 500); // Cap at 500 for safety
        this.updateUI();
    }

    startSpin() {
        if (this.isSpinning || this.balance < this.currentBet) {
            if (this.balance < this.currentBet) this.log("Insufficient balance!");
            this.autoplay = false;
            this.updateUI();
            return;
        }

        this.isSpinning = true;
        this.balance -= this.currentBet;
        this.jackpot += Math.floor(this.currentBet * 0.1); // 10% goes to jackpot
        this.stats.spins++;
        
        this.el.status.textContent = "Spinning...";
        this.el.spinBtn.disabled = true;
        this.el.stopBtns.forEach(btn => btn.disabled = false);

        this.reelStates = ['spinning', 'spinning', 'spinning'];
        this.sound.playSpin();
        
        this.el.reelStrips.forEach((strip, i) => {
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            
            // Force reflow
            strip.offsetHeight;
            
            // Random target
            const symbolHeight = 100;
            const totalSymbols = 50;
            const spinDistance = (totalSymbols - 3) * symbolHeight;
            
            strip.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${spinDistance}px)`;

            // Final symbol logic
            const finalSymbolIdx = Math.floor(Math.random() * SYMBOLS.length); // Simplified for now
            // We actually want to pick the result based on weights
            const resultSymbol = this.getRandomSymbol();
            this.results[i] = resultSymbol;

            // Replace the last symbol on the strip with our result
            strip.children[totalSymbols - 2].textContent = resultSymbol.char; // -2 is the center of the 3 visible symbols at the end
        });

        // Auto stop if not manual
        this.spinTimeout = setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                if (this.reelStates[i] === 'spinning') {
                    this.stopReel(i);
                }
            }
        }, 3500);
    }

    stopReel(idx) {
        if (this.reelStates[idx] !== 'spinning') return;
        
        const strip = this.el.reelStrips[idx];
        const computedStyle = window.getComputedStyle(strip);
        const matrix = new WebKitCSSMatrix(computedStyle.transform);
        const currentY = matrix.m42;
        
        strip.style.transition = 'transform 0.2s ease-out';
        // Snap to nearest symbol
        const symbolHeight = 100;
        const snappedY = Math.round(currentY / symbolHeight) * symbolHeight;
        strip.style.transform = `translateY(${snappedY}px)`;
        this.sound.playStop();
        
        this.reelStates[idx] = 'stopped';
        this.el.stopBtns[idx].disabled = true;

        // Determine what symbol is at the center
        // Center of viewport (300px) is 150px. 
        // Reel strip is at Y. Symbol is at index i * 100.
        // centerOffset = -Y + 100 (for the 2nd visible slot)
        const centerIdx = Math.abs(Math.round(snappedY / symbolHeight)) + 1;
        const finalChar = strip.children[centerIdx]?.textContent || '🐭';
        this.results[idx] = SYMBOLS.find(s => s.char === finalChar) || SYMBOLS[0];

        if (this.reelStates.every(s => s !== 'spinning')) {
            clearTimeout(this.spinTimeout);
            this.checkResult();
        }
    }

    checkResult() {
        this.isSpinning = false;
        this.el.spinBtn.disabled = false;
        this.el.stopBtns.forEach(btn => btn.disabled = true);

        const [s1, s2, s3] = this.results;
        let winAmount = 0;
        let message = "No win this time.";

        if (s1.char === s2.char && s2.char === s3.char) {
            // Triple match
            if (s1.name === 'Mewtwo') {
                winAmount = this.jackpot;
                this.jackpot = 1000000;
                message = "🔥 JACKPOT!!! MEWTWO AWAKENED! 🔥";
                this.triggerShake();
            } else {
                winAmount = this.currentBet * s1.value;
                message = `BIG WIN! 3x ${s1.name}!`;
            }
        } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
            // Double match
            const match = (s1.char === s2.char) ? s1 : s3;
            winAmount = Math.floor(this.currentBet * (match.value / 2));
            message = `Nice! 2x ${match.name}!`;
        }

        if (winAmount > 0) {
            this.balance += winAmount;
            this.stats.wins++;
            this.stats.streak++;
            this.el.status.textContent = message;
            this.log(`Won ₽ ${winAmount.toLocaleString()} (${message})`);
            this.triggerWinEffect();
            if (message.includes('JACKPOT')) {
                this.sound.playJackpot();
            } else {
                this.sound.playWin();
            }
        } else {
            this.stats.streak = 0;
            this.el.status.textContent = message;
        }

        this.updateUI();

        if (this.autoplay && this.balance >= this.currentBet) {
            setTimeout(() => {
                if (this.autoplay) this.startSpin();
            }, 1500);
        } else if (this.autoplay) {
            this.toggleAutoplay();
            this.log("Autoplay stopped (Low balance)");
        }
    }

    triggerWinEffect() {
        document.querySelectorAll('.reel').forEach(r => r.classList.add('winning-reel'));
        setTimeout(() => {
            document.querySelectorAll('.reel').forEach(r => r.classList.remove('winning-reel'));
        }, 2000);
    }

    triggerShake() {
        document.getElementById('game-container').classList.add('shake');
        setTimeout(() => {
            document.getElementById('game-container').classList.remove('shake');
        }, 500);
    }

    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        this.el.autoplayBtn.textContent = `AUTOPLAY: ${this.autoplay ? 'ON' : 'OFF'}`;
        this.el.autoplayBtn.style.background = this.autoplay ? '#2e7d32' : '#333';
        if (this.autoplay && !this.isSpinning) {
            this.startSpin();
        }
    }

    updateUI() {
        this.el.jackpot.textContent = `₽ ${this.jackpot.toLocaleString()}`;
        this.el.balance.textContent = `₽ ${this.balance.toLocaleString()}`;
        this.el.bet.textContent = `₽ ${this.currentBet.toLocaleString()}`;
        this.el.statSpins.textContent = this.stats.spins;
        this.el.statWins.textContent = this.stats.wins;
        this.el.statStreak.textContent = this.stats.streak;
    }

    log(msg) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.el.eventLog.prepend(entry);
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    window.game = new PokeSlots();
});
