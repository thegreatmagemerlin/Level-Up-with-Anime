// Elements
const start = document.getElementById("start");
const reset = document.getElementById("reset");
const tabname = document.getElementById("tabname");
const tHour = document.getElementById("hours");
const tMin = document.getElementById("mins");
const tSec = document.getElementById("secs");


// Initial State
tHour.textContent = "";
tMin.textContent = "25:";
tSec.textContent = "00";
let currentVolume = 2; // Default volume: 100%

let timerInterval;
let isRunning = false;

const studyModes = {
    easy: { study: 25, rest: 5 },
    normal: { study: 45, rest: 15 },
    serious: { study: 60, rest: 30 },
    hardcore: { study: 90, rest: 30 },
};

let currentDifficulty = 'normal';
let currentMode = 'study';
let currentTheme = 'spiderman';
let audio = new Audio("spiderman.mp3"); // Ensure this is declared globally
audio.loop = false;

// Helpers
function playThemeSound() {
  // Stop current playback
  audio.pause();
  audio.currentTime = 0;

  // Apply the new volume
  audio.volume = currentVolume;

  // Play the sound
  audio.play();
}

function convertMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

function updateTimer(hours, minutes, seconds) {
    if (hours > 0) {
        tHour.textContent = `${String(hours).padStart(2, "0")}:`;
        tabname.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
        tHour.textContent = "";
        tabname.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    tMin.textContent = `${String(minutes).padStart(2, "0")}:`;
    tSec.textContent = `${String(seconds).padStart(2, "0")}`;
}

function setTimerForModeAndDifficulty(mode, difficulty) {
    const durations = studyModes[difficulty];
    if (!durations) return;

    const totalMinutes = mode === 'study' ? durations.study : durations.rest;
    const { hours, minutes } = convertMinutes(totalMinutes);
    updateTimer(hours, minutes, 0);
}

function toggleMode() {
    currentMode = (currentMode === 'rest') ? 'study' : 'rest';
    setTimerForModeAndDifficulty(currentMode, currentDifficulty);

    const modeSelected = document.querySelector('.dropdown.mode-dropdown .selected');
    modeSelected.textContent = (currentMode === 'study') ? 'Study' : 'Break';
}

// Timer Logic
function startTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        start.textContent = "start";
        isRunning = false;
        return;
    }

    let hours = parseInt(tHour.textContent) || 0;
    let minutes = parseInt(tMin.textContent) || 0;
    let seconds = parseInt(tSec.textContent) || 0;

    start.textContent = "stop";
    isRunning = true;

    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                if (hours === 0) {
                    clearInterval(timerInterval);
                    start.textContent = "start";
                    isRunning = false;
                    playThemeSound();
                    toggleMode();
                    return;
                }
                hours--;
                minutes = 59;
                seconds = 59;
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }

        updateTimer(hours, minutes, seconds);
    }, 1000);
}

function resetTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        start.textContent = "start";
        isRunning = false;
    }

    setTimerForModeAndDifficulty(currentMode, currentDifficulty);
    tabname.textContent = "Study Timer";

    const modeSelected = document.querySelector('.dropdown.mode-dropdown .selected');
    modeSelected.textContent = (currentMode === 'study') ? 'Study' : 'Break';
}

// Dropdown Setup
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            const value = option.dataset.value || option.innerText.trim().toLowerCase();

            dropdown.dispatchEvent(new CustomEvent("dropdownChange", {
                detail: { value }
            }));
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
        }
    });
});

// Dropdown Handlers
const themeDropdown = document.querySelector('.dropdown.theme-dropdown');
themeDropdown.addEventListener('dropdownChange', (e) => {
    currentTheme = e.detail.value;
    document.body.className = '';
    document.body.classList.add(`theme-${currentTheme}`);
    audio = new Audio(`${currentTheme}.mp3`);
});

const difficultyDropdown = document.querySelector('.dropdown.diff-dropdown');
difficultyDropdown.addEventListener('dropdownChange', (e) => {
    currentDifficulty = e.detail.value;
    setTimerForModeAndDifficulty(currentMode, currentDifficulty);
});

const modeDropdown = document.querySelector('.dropdown.mode-dropdown');
modeDropdown.addEventListener('dropdownChange', (e) => {
    const mode = e.detail.value;
    currentMode = (mode === 'break') ? 'rest' : 'study';
    setTimerForModeAndDifficulty(currentMode, currentDifficulty);
});

// Button Events
start.addEventListener("click", startTimer);
reset.addEventListener("click", resetTimer);

// Initialize
setTimerForModeAndDifficulty(currentMode, currentDifficulty);

const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");

volumeSlider.addEventListener("input", () => {
    const volumePercent = volumeSlider.value;
    currentVolume = volumePercent / 100;
    volumeValue.textContent = `${volumePercent}%`;
    playThemeSound();
});