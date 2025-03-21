class ZombieSurvival {
    static config = {
        initialLives: 5,
        maxLives: 7,
        baseZombieProb: 20,
        probIncreasePerDay: 4,
        gridSize: 8,
        initialWeapons: 3,
        tilesPerDay: 16,  // Tiles to reveal before day advances
        specialTileChance: 15  // % chance of special tiles
    };

    static state = {
        lives: this.config.initialLives,
        weapons: this.config.initialWeapons,
        day: 1,
        zombiesKilled: 0,
        score: 0,
        log: [],
        gameActive: true,
        kitUsed: false,
        tilesRevealed: 0,
        totalTiles: this.config.gridSize * this.config.gridSize,
        tilesThisDay: 0
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
        this.state.totalTiles = this.config.gridSize * this.config.gridSize;

        for(let y = 0; y < this.config.gridSize; y++) {
            for(let x = 0; x < this.config.gridSize; x++) {
                const tile = document.createElement('div');
                tile.className = 'grid-tile locked';
                tile.dataset.x = x;
                tile.dataset.y = y;

                const distanceFromCenter = Math.abs(x - 3.5) + Math.abs(y - 3.5);
                const finalProb = Math.max(zombieProb - (distanceFromCenter * 2), 15);

                tile.dataset.prob = finalProb;
                tile.dataset.type = this.getTileType();
                tile.addEventListener('click', () => this.handleTileClick(tile));
                grid.appendChild(tile);
            }
        }
        
        this.state.tilesRevealed = 0;
        this.state.tilesThisDay = 0;
    }

    static getTileType() {
        const roll = Math.random() * 100;
        if (roll < this.config.specialTileChance / 3) return 'ammo';
        if (roll < this.config.specialTileChance * 2 / 3) return 'health';
        if (roll < this.config.specialTileChance) return 'trap';
        return 'normal';
    }

    static handleTileClick(tile) {
        if (!this.state.gameActive || 
            tile.classList.contains('revealed') || 
            !this.state.kitUsed) return;

        tile.classList.add('revealed');
        tile.classList.remove('locked');
        this.state.tilesRevealed++;
        this.state.tilesThisDay++;

        switch(tile.dataset.type) {
            case 'ammo':
                this.handleAmmoTile(tile);
                break;
            case 'health':
                this.handleHealthTile(tile);
                break;
            case 'trap':
                this.handleTrapTile(tile);
                break;
            default:
                this.handleNormalTile(tile);
        }

        this.checkDayProgression();
        if (this.state.tilesRevealed === this.state.totalTiles) {
            this.handleGameWon();
        }
    }

    static handleNormalTile(tile) {
        const isZombie = Math.random() * 100 < tile.dataset.prob;
        if (isZombie) {
            this.handleZombieEncounter(tile);
        } else {
            this.state.score += 10;
            this.addLog(`Día ${this.state.day}: Zona segura en [${tile.dataset.x},${tile.dataset.y}]`);
            this.updateUI();
        }
    }

    static handleZombieEncounter(tile) {
        tile.classList.add('zombie');
        const hordeChance = Math.min(this.state.day * 5, 30);
        const isHorde = Math.random() * 100 < hordeChance;
        const zombieCount = isHorde ? 
            Math.floor(tile.dataset.prob / 10) + this.state.day : 
            Math.floor(tile.dataset.prob / 15) + 1;
        
        const defense = Math.min(this.state.weapons, zombieCount);
        const damage = zombieCount - defense;

        this.state.lives -= damage;
        this.state.weapons -= defense;
        this.state.zombiesKilled += defense;
        this.state.score += defense * 25;

        this.addLog(
            `Día ${this.state.day}: ${isHorde ? '¡Horda!' : ''} ${zombieCount} zombies en [${tile.dataset.x},${tile.dataset.y}]! ` +
            `(Defensa: ${defense}, Daño: ${damage})`
        );

        this.checkGameState();
    }

    static handleAmmoTile(tile) {
        tile.classList.add('ammo');
        const ammo = Math.floor(Math.random() * 3) + 2;
        this.state.weapons += ammo;
        this.state.score += 50;
        this.addLog(`Día ${this.state.day}: ¡Munición encontrada! +${ammo} armas en [${tile.dataset.x},${tile.dataset.y}]`);
        this.updateUI();
    }

    static handleHealthTile(tile) {
        tile.classList.add('health');
        const health = Math.random() > 0.5 ? 2 : 1;
        this.state.lives = Math.min(this.state.lives + health, this.config.maxLives);
        this.state.score += 75;
        this.addLog(`Día ${this.state.day}: ¡Kit médico! +${health} vida en [${tile.dataset.x},${tile.dataset.y}]`);
        this.updateUI();
    }

    static handleTrapTile(tile) {
        tile.classList.add('trap');
        const damage = Math.floor(this.state.day / 2) + 1;
        this.state.lives -= damage;
        this.addLog(`Día ${this.state.day}: ¡Trampa! -${damage} vida en [${tile.dataset.x},${tile.dataset.y}]`);
        this.checkGameState();
    }

    static checkDayProgression() {
        if (this.state.tilesThisDay >= this.config.tilesPerDay && 
            this.state.tilesRevealed < this.state.totalTiles) {
            this.state.day++;
            this.state.tilesThisDay = 0;
            this.state.kitUsed = false;
            this.lockGrid();
            this.addLog(`¡Día ${this.state.day} comienza! Zombies más fuertes...`);
            this.updateUI();
        }
    }

    static useKit() {
        if (this.state.kitUsed || !this.state.gameActive) return;

        const weaponsGained = Math.floor(Math.random() * 3) + 1;
        const healthChance = Math.max(0.3, 0.8 - (this.state.day * 0.1));
        const healthGained = Math.random() < healthChance ? 1 : 0;

        this.state.weapons += weaponsGained;
        this.state.lives = Math.min(this.state.lives + healthGained, this.config.maxLives);
        this.state.kitUsed = true;
        this.state.score += 25;

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

        let tileInfo = '';
        switch(randomTile.dataset.type) {
            case 'ammo': tileInfo = 'munición'; break;
            case 'health': tileInfo = 'kit médico'; break;
            case 'trap': tileInfo = 'trampa'; break;
            default: tileInfo = `${randomTile.dataset.prob}% peligro`; break;
        }

        this.addLog(`Radar: [${randomTile.dataset.x},${randomTile.dataset.y}] - ${tileInfo}`);
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
        if (this.state.lives <= 0) {
            this.state.gameActive = false;
            this.showMessage(`¡GAME OVER! Puntuación: ${this.state.score} - ${this.state.day} días`, true);
            this.lockGrid();
        }
        this.updateUI();
    }

    static handleGameWon() {
        this.state.gameActive = false;
        this.state.score += 1000; // Bonus for winning
        this.showMessage(`¡VICTORIA! Puntuación: ${this.state.score} - ${this.state.day} días`, true);
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
            score: 0,
            log: [],
            gameActive: true,
            kitUsed: false,
            tilesRevealed: 0,
            totalTiles: this.config.gridSize * this.config.gridSize,
            tilesThisDay: 0
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
        document.getElementById('score').textContent = this.state.score;

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