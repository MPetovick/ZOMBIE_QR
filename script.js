// Estado inicial del jugador
let lives = 3;
let weapons = 0;
let day = 1;
let logEntries = [];
let hasScannedSurvivalKit = false;

// Función para usar el Survival Kit
function scanSurvivalKit() {
    if (hasScannedSurvivalKit) {
        alert("¡Ya has usado el Survival Kit hoy!");
        return;
    }

    const result = getRandomSurvivalKitResult();
    updateStats(result);
    logEntries.push(`Día ${day}: Survival Kit - ${formatResult(result)}`);
    updateLog();
    hasScannedSurvivalKit = true;
    document.getElementById("scanned-status").textContent = "Sí";
}

// Función para enfrentar un Zombie
function scanZombieCard() {
    if (!hasScannedSurvivalKit) {
        alert("¡Debes escanear el Survival Kit antes de enfrentar zombies!");
        return;
    }

    const result = getRandomZombieResult();
    updateStats(result);
    logEntries.push(`Día ${day}: Zombie Card - ${formatResult(result)}`);
    updateLog();

    // Reiniciar el estado para el siguiente día
    hasScannedSurvivalKit = false;
    document.getElementById("scanned-status").textContent = "No";

    // Incrementar el contador de días
    day++;
    document.getElementById("day").textContent = day;
}

// Función para obtener un resultado aleatorio de Survival Kit
function getRandomSurvivalKitResult() {
    const results = [
        { type: "health", value: 1, probability: 24 },
        { type: "health", value: 2, probability: 8 },
        { type: "health", value: 3, probability: 4 },
        { type: "weapon", value: 1, probability: 24 },
        { type: "weapon", value: 2, probability: 8 },
        { type: "weapon", value: 3, probability: 4 },
        { type: "skip", value: 1, probability: 12 },
        { type: "empty", value: 0, probability: 16 }
    ];
    return getRandomResult(results);
}

// Función para obtener un resultado aleatorio de Zombie Card
function getRandomZombieResult() {
    const results = [
        { type: "zombie", value: 1, probability: 40 },
        { type: "zombie", value: 2, probability: 20 },
        { type: "zombie", value: 3, probability: 12 },
        { type: "horde", value: 3, probability: 8 },
        { type: "clean", value: 0, probability: 20 }
    ];
    return getRandomResult(results);
}

// Función para obtener un resultado aleatorio basado en probabilidades
function getRandomResult(results) {
    const totalProbability = results.reduce((sum, result) => sum + result.probability, 0);
    const randomValue = Math.floor(Math.random() * totalProbability);
    let cumulativeProbability = 0;

    for (const result of results) {
        cumulativeProbability += result.probability;
        if (randomValue < cumulativeProbability) {
            return result;
        }
    }
}

// Función para formatear el resultado como texto
function formatResult(result) {
    switch (result.type) {
        case "health":
            return `+${result.value} ❤️`;
        case "weapon":
            return `+${result.value} ⛏`;
        case "skip":
            return `⚡ Saltar turno`;
        case "empty":
            return `❌ Vacío`;
        case "zombie":
            return `🧟‍♂ x${result.value}`;
        case "horde":
            return `☠ Horda (+${result.value} zombies)`;
        case "clean":
            return `✅ Área limpia`;
        default:
            return "";
    }
}

// Función para actualizar las estadísticas del jugador
function updateStats(result) {
    if (result.type === "health") {
        lives = Math.min(lives + result.value, 7);
    } else if (result.type === "weapon") {
        weapons += result.value;
    } else if (result.type === "zombie") {
        const damage = Math.max(result.value - weapons, 0);
        lives -= damage;
        weapons = Math.max(weapons - result.value, 0);
    } else if (result.type === "horde") {
        lives -= result.value;
    }

    document.getElementById("lives").textContent = lives;
    document.getElementById("weapons").textContent = weapons;

    if (lives <= 0) {
        alert(`¡Has perdido! Sobreviviste ${day - 1} días.`);
        resetGame();
    }
}

// Función para actualizar el registro del día
function updateLog() {
    const logList = document.getElementById("log-entries");
    logList.innerHTML = logEntries.map(entry => `<li>${entry}</li>`).join("");
}

// Función para reiniciar el juego
function resetGame() {
    lives = 3;
    weapons = 0;
    day = 1;
    logEntries = [];
    hasScannedSurvivalKit = false;
    document.getElementById("lives").textContent = lives;
    document.getElementById("weapons").textContent = weapons;
    document.getElementById("day").textContent = day;
    document.getElementById("scanned-status").textContent = "No";
    updateLog();
}
