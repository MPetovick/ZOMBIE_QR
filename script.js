// Configuración del juego
const GameConfig = {
  maxLives: 7,
  initialLives: 3,
  maxLogEntries: 8
};

// Estado del juego
const GameState = {
  lives: GameConfig.initialLives,
  weapons: 0,
  day: 1,
  zombiesKilled: 0,
  hasUsedKit: false,
  log: []
};

// Elementos UI
const UI = {
  lives: document.getElementById('lives'),
  weapons: document.getElementById('weapons'),
  day: document.getElementById('day'),
  zombiesKilled: document.getElementById('zombies-killed'),
  logEntries: document.getElementById('log-entries')
};

// Resultados posibles
const Results = {
  KIT: [
    { type: 'health', value: 1, prob: 35, icon: '❤️' },
    { type: 'weapon', value: 1, prob: 35, icon: '⛏️' },
    { type: 'double', value: 2, prob: 15, icon: '🎁' },
    { type: 'empty', value: 0, prob: 15, icon: '❌' }
  ],
  
  ZOMBIE: [
    { type: 'zombie', value: 1, prob: 50, icon: '🧟' },
    { type: 'horde', value: 3, prob: 20, icon: '🧟‍♂️x3' },
    { type: 'boss', value: 5, prob: 5, icon: '💀' },
    { type: 'clean', value: 0, prob: 25, icon: '✅' }
  ]
};

// Núcleo del juego
const GameCore = {
  getRandomResult(results) {
    const total = results.reduce((sum, { prob }) => sum + prob, 0);
    const random = Math.random() * total;
    return results.reduce(({ accumulator, selected }, curr) => {
      return (accumulator += curr.prob) >= random && !selected 
        ? { accumulator, selected: curr } 
        : { accumulator, selected };
    }, { accumulator: 0, selected: null }).selected;
  },

  calculateCombat(zombies, weapons) {
    const kills = Math.min(weapons, zombies);
    return {
      damage: Math.max(zombies - weapons, 0),
      kills,
      weaponsUsed: kills
    };
  }
};

// Gestión de estado
const StateManager = {
  updateUI() {
    UI.lives.textContent = GameState.lives;
    UI.weapons.textContent = GameState.weapons;
    UI.day.textContent = GameState.day;
    UI.zombiesKilled.textContent = GameState.zombiesKilled;
    
    UI.logEntries.innerHTML = GameState.log
      .map(entry => `<li class="log-entry">${entry}</li>`)
      .join('');
    this.saveState();
  },

  saveState() {
    const saveData = localStorage.getItem('zombieSave');
    if (saveData) {
      const data = JSON.parse(saveData);
      data.lives = GameState.lives;
      data.weapons = GameState.weapons;
      data.day = GameState.day;
      data.zombiesKilled = GameState.zombiesKilled;
      data.log = GameState.log;
      localStorage.setItem('zombieSave', JSON.stringify(data));
    }
  },

  reset() {
    GameState.lives = GameConfig.initialLives;
    GameState.weapons = 0;
    GameState.day = 1;
    GameState.zombiesKilled = 0;
    GameState.hasUsedKit = false;
    GameState.log = [];
    this.updateUI();
  }
};

// Acciones del juego
const GameActions = {
  useKit() {
    if (GameState.hasUsedKit) return this.showMessage('¡Kit ya usado hoy!');
    
    const result = GameCore.getRandomResult(Results.KIT);
    this.processResult(result, 'Kit');
    GameState.hasUsedKit = true;
    StateManager.updateUI();
  },

  fightZombie() {
    if (!GameState.hasUsedKit) return this.showMessage('¡Usa el kit primero!');
    
    const result = GameCore.getRandomResult(Results.ZOMBIE);
    this.processResult(result, 'Combate');
    
    GameState.day++;
    GameState.hasUsedKit = false;
    this.checkGameOver();
    StateManager.updateUI();
  },

  processResult(result, actionType) {
    switch(result.type) {
      case 'health':
        GameState.lives = Math.min(GameState.lives + result.value, GameConfig.maxLives);
        break;
        
      case 'weapon':
      case 'double':
        GameState.weapons += result.value;
        break;
        
      case 'zombie':
      case 'horde':
      case 'boss':
        const combat = GameCore.calculateCombat(result.value, GameState.weapons);
        GameState.lives -= combat.damage;
        GameState.weapons -= combat.weaponsUsed;
        GameState.zombiesKilled += combat.kills;
        break;
    }
    
    const message = `${actionType}: ${result.icon} ${this.formatResult(result)}`;
    GameState.log.unshift(message);
    GameState.log = GameState.log.slice(0, GameConfig.maxLogEntries);
  },

  formatResult({ type, value }) {
    const messages = {
      health: `+${value} Vida`,
      weapon: `+${value} Armas`,
      double: `+${value} Recursos`,
      zombie: `${value} Zombie`,
      horde: `Horda de ${value}`,
      boss: 'Jefe Zombie!',
      clean: 'Área segura',
      empty: 'Kit vacío'
    };
    return messages[type] || '';
  },

  showMessage(text) {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = text;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2500);
  },

  checkGameOver() {
    if (GameState.lives > 0) return;
    
    this.showMessage(`Game Over! Días: ${GameState.day - 1} | Zombies: ${GameState.zombiesKilled}`);
    StateManager.reset();
  }
};

// Sistema de usuario y guardado
const UserManager = {
  init() {
    this.loadUser();
    this.setupModal();
  },

  setupModal() {
    const modal = document.getElementById('loginModal');
    const btn = document.getElementById('loginBtn');
    const span = document.querySelector('.close');

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
      if (event.target == modal) modal.style.display = 'none';
    }
  },

  saveProgress() {
    const nickname = document.getElementById('nickname').value;
    if (!nickname) return;
    
    const saveData = {
      nickname,
      ...GameState
    };
    
    localStorage.setItem('zombieSave', JSON.stringify(saveData));
    this.showMessage('Progreso guardado');
    document.getElementById('loginModal').style.display = 'none';
  },

  loadUser() {
    const savedData = localStorage.getItem('zombieSave');
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.assign(GameState, data);
      this.showMessage(`Bienvenido ${data.nickname || 'Jugador'}`);
      StateManager.updateUI();
    }
  },

  showMessage(text) {
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = text;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }
};

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  UserManager.init();
  StateManager.updateUI();
});
