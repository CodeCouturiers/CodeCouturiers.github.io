const pranayamaTypes = {
    SvaraPranayama: "Свара-пранаяма",
    NadiShodhana: "Нади-шодхана",
    Bhastrika: "Бхастрика",
    Sitkari: "Ситкари",
    Shitkari: "Шиткари",
    Bhramari: "Бхрамари",
    Ujjayi: "Уджайи"
};

const trainingModes = {
    Beginner: "Новичок",
    Intermediate: "Базовый",
    Advanced: "Средний",
    Expert: "Эксперт"
};

let currentSeconds = 0;
let targetSeconds = 0;
let currentPhase = "";
let currentPranayama = "";
let currentTrainingMode = "";
let timerInterval;

function initializeSelects() {
    const pranayamaSelect = document.getElementById("pranayamaType");
    const trainingModeSelect = document.getElementById("trainingMode");

    for (const [key, value] of Object.entries(pranayamaTypes)) {
        pranayamaSelect.add(new Option(value, key));
    }

    for (const [key, value] of Object.entries(trainingModes)) {
        trainingModeSelect.add(new Option(value, key));
    }
}

function updateTimerDisplay() {
    document.getElementById("currentTime").textContent = formatTime(currentSeconds);
    document.getElementById("targetTime").textContent = formatTime(targetSeconds);
    document.getElementById("currentPhase").textContent = currentPhase;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateInstructions() {
    const instructionsElement = document.getElementById("instructions");
    let newInstructions = "";

    switch (currentPranayama) {
        case "SvaraPranayama":
            newInstructions = updateSvaraPranayamaInstructions();
            break;
        // Add other pranayama types here
    }

    anime({
        targets: instructionsElement,
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
            instructionsElement.textContent = newInstructions;
            anime({
                targets: instructionsElement,
                opacity: [0, 1],
                duration: 500,
                easing: 'easeInOutQuad'
            });
        }
    });
}

function updateSvaraPranayamaInstructions() {
    const cycleLength = getCycleLength(20);
    const cycle = currentSeconds % cycleLength;
    const phaseLength = cycleLength / 4;

    if (cycle < phaseLength) {
        currentPhase = "Наблюдение";
        targetSeconds = phaseLength;
        return "Наблюдайте за естественным дыханием";
    } else if (cycle < phaseLength * 2) {
        currentPhase = "Вдох";
        targetSeconds = phaseLength * 2;
        return "Сделайте медленный, глубокий вдох";
    } else if (cycle < phaseLength * 3) {
        currentPhase = "Задержка";
        targetSeconds = phaseLength * 3;
        return "Задержите дыхание";
    } else {
        currentPhase = "Выдох";
        targetSeconds = cycleLength;
        return "Медленно выдохните";
    }
}

function getCycleLength(baseCycleLength) {
    switch (currentTrainingMode) {
        case "Beginner": return baseCycleLength;
        case "Intermediate": return Math.floor(baseCycleLength * 1.5);
        case "Advanced": return baseCycleLength * 2;
        case "Expert": return baseCycleLength * 3;
        default: return baseCycleLength;
    }
}

function startPranayama() {
    const pranayamaSelect = document.getElementById("pranayamaType");
    const trainingModeSelect = document.getElementById("trainingMode");

    if (!pranayamaSelect.value || !trainingModeSelect.value) {
        alert("Пожалуйста, выберите тип пранаямы и режим тренировки.");
        return;
    }

    currentPranayama = pranayamaSelect.value;
    currentTrainingMode = trainingModeSelect.value;
    currentSeconds = 0;
    targetSeconds = 0;
    currentPhase = "";

    updateInstructions();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        currentSeconds++;
        if (currentSeconds > targetSeconds) {
            currentSeconds = 0;
        }
        updateInstructions();
        updateTimerDisplay();
    }, 1000);

    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
}

function stopPranayama() {
    clearInterval(timerInterval);
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("instructions").textContent = "Практика завершена";
    currentPhase = "Завершено";
    updateTimerDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeSelects();
    document.getElementById("startBtn").addEventListener("click", startPranayama);
    document.getElementById("stopBtn").addEventListener("click", stopPranayama);
});