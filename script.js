class ZombieSurvival {
    static config = {
        initialLives: 5,
        maxLives: 7,
        baseZombieProb: 25,
        probIncreasePerDay: 3,
        gridSize: 8,
        initialWeapons: 3
    };

    static state = {
        lives: this.config.initialLives,
        weapons: this.config.initialWeapons,
        day: 1,
        zombiesKilled: 0,
        log: [],
        gameActive: true,
        kitUsed: false
    };

    static init() {
        this.bindEvents();
        this.generateGrid();
        this.updateUI();
        this.showHelp();
    }

    static bindEvents() {
        document.getElementById('useKit').addEventListener('click', () => this.useKit());
        document.getElementById('useRadar').addEventListener('click', () => this.useRadar());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    static generateGrid() {
        const grid = document.getElementById('zombieGrid');
        grid.innerHTML = '';
        
        const zombieProb = this.config.baseZombieProb + 
                         (this.state.day * this.config.probIncreasePerDay);
        
        for(let y = 0; y < this.config.gridSize; y++) {
            for(let x = 0; x < this.config.gridSize; x++) {
                const tile = document.createElement('div');
                tile.className = 'grid-tile locked';
                
                const distanceFromCenter = Math.abs(x - 3.5) + Math.abs(y - 3.5);
                const finalProb = Math.max(zombieProb - (distanceFromCenter * 3), 15);
                
                tile.dataset.prob = finalProb;
                tile.addEventListener('click', () => this.handleTileClick(tile));
                grid.appendChild(tile);
            }
        }
    }

    static handleTileClick(tile) {
        if (!this.state.gameActive || tile.classList.contains('revealed') || !this.state.kitUsed) return;
        
        tile.classList.add('revealed');
        tile.classList.remove('locked');
        const isZombie = Math.random() * 100 < tile.dataset.prob;

        isZombie ? this.handleZombieEncounter(tile) : this.handleSafeZone();
    }

    static handleZombieEncounter(tile) {
        tile.classList.add('zombie');
        const zombieCount = Math.floor(tile.dataset.prob / 15) + 1;
        const defense = Math.min(this.state.weapons, zombieCount);
        
        this.state.lives -= (zombieCount - defense);
        this.state.weapons -= defense;
        this.state.zombiesKilled += defense;
        
        this.addLog(
            `Día ${this.state.day}: ${zombieCount} zombies! ` +
            `(Defensa: ${defense}, Daño: ${zombieCount - defense})`
        );
        
        this.checkGameState();
    }

    static handleSafeZone() {
        this.state.day++;
        this.state.kitUsed = false;
        this.addLog(`Día ${this.state.day}: Zona segura encontrada`);
        this.lockGrid();
        this.generateGrid();
        this.updateUI();
    }

    static useKit() {
        if (this.state.kitUsed || !this.state.gameActive) return;
        
        const weaponsGained = Math.floor(Math.random() * 2) + 1;
        const healthGained = Math.random() > 0.8 ? 1 : 0;
        
        this.state.weapons += weaponsGained;
        this.state.lives = Math.min(this.state.lives + healthGained, this.config.maxLives);
        this.state.kitUsed = true;
        
        this.unlockGrid();
        this.addLog(`Kit usado: +${weaponsGained} armas` + (healthGained ? ` +${healthGained} vida` : ''));
        this.updateUI();
    }

    static useRadar() {
        if (this.state.weapons < 3 || !this.state.gameActive) {
            this.showMessage('¡No hay suficientes armas!');
            return;
        }
        
        this.state.weapons -= 3;
        const tiles = document.querySelectorAll('.grid-tile:not(.revealed)');
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        
        this.addLog(`Radar: Casilla [${randomTile.dataset.prob}%] de peligro`);
        this.highlightTile(randomTile);
        this.updateUI();
    }

    static highlightTile(tile) {
        tile.style.transform = 'scale(1.1)';
        tile.style.boxShadow = '0 0 15px var(--rojo)';
        setTimeout(() => {
            tile.style.transform = '';
            tile.style.boxShadow = '';
        }, 1000);
    }

    static unlockGrid() {
        document.querySelectorAll('.grid-tile').forEach(tile => {
            if (!tile.classList.contains('revealed')) {
                tile.classList.remove('locked');
            }
        });
    }

    static lockGrid() {
        document.querySelectorAll('.grid-tile').forEach(tile => {
            if (!tile.classList.contains('revealed')) {
                tile.classList.add('locked');
            }
        });
    }

    static checkGameState() {
        if (this.state.lives > 0) {
            this.updateUI();
            return;
        }
        
        this.state.gameActive = false;
        this.showMessage(`¡GAME OVER! Sobreviviste ${this.state.day} días`, true);
        this.lockGrid();
    }

    static showHelp() {
        document.getElementById('helpModal').style.display = 'block';
    }

    static closeModal() {
        document.getElementById('helpModal').style.display = 'none';
    }

    static handleOutsideClick(e) {
        const modal = document.getElementById('helpModal');
        if (e.target === modal) {
            this.closeModal();
        }
    }

    static startNewGame() {
        this.closeModal();
        this.resetGame();
    }

    static resetGame() {
        this.state = {
            lives: this.config.initialLives,
            weapons: this.config.initialWeapons,
            day: 1,
            zombiesKilled: 0,
            log: [],
            gameActive: true,
            kitUsed: false
        };
        
        this.generateGrid();
        this.updateUI();
        this.showMessage("¡Nuevo juego comenzado!");
    }

    static addLog(message) {
        this.state.log.unshift(`<li class="log-entry">${message}</li>`);
        if (this.state.log.length > 8) this.state.log.pop();
    }

    static updateUI() {
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('weapons').textContent = this.state.weapons;
        document.getElementById('day').textContent = this.state.day;
        document.getElementById('zombies-killed').textContent = this.state.zombiesKilled;
        
        document.getElementById('log-entries').innerHTML = this.state.log.join('');
        
        document.getElementById('useKit').disabled = !this.state.gameActive || this.state.kitUsed;
        document.getElementById('useRadar').disabled = !this.state.gameActive || this.state.weapons < 3;
    }

    static showMessage(text, isGameOver = false) {
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        
        if (isGameOver) {
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--negro);
                padding: 2rem;
                border: 3px solid var(--rojo);
                border-radius: 10px;
                font-size: 1.5rem;
                z-index: 1000;
            `;
        }
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), isGameOver ? 5000 : 3000);
    }
}

window.addEventListener('DOMContentLoaded', () => ZombieSurvival.init());
