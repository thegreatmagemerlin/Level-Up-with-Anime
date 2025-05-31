// Timer code
var start = document.getElementById("start");
var timer = document.getElementById("timer");
var reset = document.getElementById("reset");
var tHour = document.getElementById("hours");
var tMin = document.getElementById("mins");
var tSec = document.getElementById("secs");
start.addEventListener("click", start_timer);
reset.addEventListener("click", reset_timer);
let currentTheme = 'batman.mp3'; // Default theme name

var startHour = tHour.textContent;
var startMin = tMin.textContent;
var startSec = tSec.textContent;

let timerInterval;
let isRunning = false;

function playThemeSound() {
    const audio = new Audio(`${currentTheme}.mp3`);
    audio.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}

function reset_timer() {
    if (isRunning){
        start_timer()
    }
    tHour.textContent = startHour
    tMin.textContent = startMin
    tSec.textContent = startSec
}
function start_timer () {

    // Stop timer if it running
    if (isRunning){
        clearInterval(timerInterval);
        start.textContent = "start";
        isRunning = false;
        return;
    }

    // Get minutes and seconds from timer
    let hours = parseInt(tHour.textContent, 10);
    let minutes = parseInt(tMin.textContent, 10);
    let seconds = parseInt(tSec.textContent, 10);


    // Start timer and reduce seconds and minutes
    start.textContent = "stop"
    isRunning = true;
    timerInterval = setInterval(()=>{
        if (seconds === 0) { // Timer countdown functionality
            if (minutes === 0) { // Resets timer when min and sec is 0
                if (hours === 0){
                clearInterval(timerInterval);
                start.textContent = "start";
                isRunning = false;
                playThemeSound();
                return;
            }
            hours--;
            minutes = 60
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        // Update timer on HTML

        tHour.textContent = `${String(hours).padStart(2, "0")}`
        tMin.textContent = `${String(minutes).padStart(2, "0")}`
        tSec.textContent = `${String(seconds).padStart(2, "0")}`

        // timer.textContent = 
        // `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }, 1000);
}

// Dropdown menu code
//get all dropdowns from the document
// Only one dropdown assumed
const dropdown = document.querySelector('.dropdown');
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

// Close menu and set theme style once option is selected
options.forEach(option => {
    option.addEventListener('click', () => {
        // Update the dropdown label
        selected.innerText = `Theme: ${option.innerText}`;
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');

        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // ✅ Dynamically change the stylesheet
        document.body.className = ''; // Remove previous theme class
        currentTheme = option.innerText.trim().toLowerCase(); // Global variable
        document.body.classList.add(`theme-${currentTheme}`);
    });
});

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        select.classList.remove('select-clicked');
        caret.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
    }
});

