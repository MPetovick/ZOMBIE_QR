class GameManager {
    static config = {
        initialLives: 5,
        maxLives: 7,
        baseZombieProb: 25,
        probIncreasePerDay: 2,
        gridSize: 8,
        initialWeapons: 3
    };

    static state = {
        lives: this.config.initialLives,
        weapons: this.config.initialWeapons,
        day: 1,
        zombiesKilled: 0,
        currentGrid: [],
        log: [],
        gameActive: true
    };

    static init() {
        this.generateNewGrid();
        this.updateUI();
        this.setupEventListeners();
    }

    static generateNewGrid() {
        const gridContainer = document.getElementById('zombieGrid');
        gridContainer.innerHTML = '';
        
        const zombieProb = this.config.baseZombieProb + 
                         (this.state.day * this.config.probIncreasePerDay);
        
        for(let y = 0; y < this.config.gridSize; y++) {
            for(let x = 0; x < this.config.gridSize; x++) {
                const tile = document.createElement('div');
                tile.className = 'grid-tile';
                
                const distanceFromCenter = Math.abs(x - 3.5) + Math.abs(y - 3.5);
                const finalProb = Math.max(zombieProb - (distanceFromCenter * 3), 10);
                
                tile.dataset.prob = finalProb;
                tile.addEventListener('click', () => this.handleTileClick(tile));
                gridContainer.appendChild(tile);
            }
        }
    }

    static handleTileClick(tile) {
        if (!this.state.gameActive || tile.classList.contains('revealed')) return;
        
        tile.classList.add('revealed');
        const isZombie = Math.random() * 100 < tile.dataset.prob;

        if (isZombie) {
            this.handleZombieEncounter(tile);
        } else {
            this.handleSafeZone();
        }
    }

    static handleZombieEncounter(tile) {
        tile.classList.add('zombie');
        const zombieCount = Math.floor(tile.dataset.prob / 15) + 1;
        const defense = Math.min(this.state.weapons, zombieCount);
        
        this.state.lives -= (zombieCount - defense);
        this.state.weapons -= defense;
        this.state.zombiesKilled += defense;
        
        this.addLogEntry(
            `Día ${this.state.day}: ¡${zombieCount} zombies! ` +
            `(Defensa: ${defense}, Daño: ${zombieCount - defense})`
        );
        
        this.checkGameState();
    }

    static handleSafeZone() {
        this.state.day++;
        this.addLogEntry(`Día ${this.state.day}: Zona segura encontrada`);
        this.updateUI();
    }

    static useKit() {
        if (this.state.day === 1 || !this.state.gameActive) return;
        
        const resources = {
            weapons: Math.floor(Math.random() * 3) + 1,
            health: Math.random() > 0.7 ? 1 : 0
        };
        
        this.state.weapons += resources.weapons;
        this.state.lives = Math.min(
            this.state.lives + resources.health, 
            this.config.maxLives
        );
        
        this.addLogEntry(
            `Kit usado: +${resources.weapons} armas` + 
            (resources.health ? ` +${resources.health} vida` : '')
        );
        
        this.generateNewGrid();
        this.updateUI();
    }

    static useRadar() {
        if (this.state.weapons < 3 || !this.state.gameActive) {
            this.showMessage('¡No tienes suficientes armas!');
            return;
        }
        
        this.state.weapons -= 3;
        const tiles = document.querySelectorAll('.grid-tile:not(.revealed)');
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        
        randomTile.style.backgroundColor = '#330000';
        setTimeout(() => {
            randomTile.style.backgroundColor = '';
        }, 1000);
        
        this.addLogEntry(`Radar usado: ${randomTile.dataset.prob}% de peligro`);
        this.updateUI();
    }

    static checkGameState() {
        if (this.state.lives > 0) {
            this.updateUI();
            return;
        }
        
        this.state.gameActive = false;
        this.showMessage(
            `¡GAME OVER! Días: ${this.state.day} | Zombies: ${this.state.zombiesKilled}`,
            true
        );
    }

    static resetGame() {
        this.state = {
            lives: this.config.initialLives,
            weapons: this.config.initialWeapons,
            day: 1,
            zombiesKilled: 0,
            currentGrid: [],
            log: [],
            gameActive: true
        };
        
        this.generateNewGrid();
        this.updateUI();
    }

    static addLogEntry(message) {
        this.state.log.unshift(message);
        if (this.state.log.length > 8) this.state.log.pop();
    }

    static updateUI() {
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('weapons').textContent = this.state.weapons;
        document.getElementById('day').textContent = this.state.day;
        document.getElementById('zombies-killed').textContent = this.state.zombiesKilled;
        
        document.getElementById('log-entries').innerHTML = this.state.log
            .map(entry => `<li class="log-entry">${entry}</li>`)
            .join('');
    }

    static showMessage(text, isGameOver = false) {
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        
        if (isGameOver) {
            message.style.color = 'var(--rojo)';
            message.style.fontSize = '1.5rem';
            message.style.padding = '1rem';
            message.style.border = '2px solid var(--rojo)';
        }
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), isGameOver ? 5000 : 2500);
    }

    static setupEventListeners() {
        document.getElementById('useKit').addEventListener('click', () => this.useKit());
        document.getElementById('useRadar').addEventListener('click', () => this.useRadar());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
    }
}

// Inicializar el juego al cargar la página
window.addEventListener('DOMContentLoaded', () => GameManager.init());
