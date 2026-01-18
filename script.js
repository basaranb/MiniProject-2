// Constants
const TRANSITION_DELAY = 500; // milliseconds

// Data Model: Routes with mobility options
// Each route contains the same 5 standardized mobility options
// Core attributes: time (minutes), cost (euros), co2 (grams)
const routes = [
    {
        id: 'route1',
        name: 'City Center to University',
        options: [
            {
                id: 'public_transport',
                name: 'Public Transportation',
                time: 35,              // minutes
                cost: 2.50,            // euros
                co2: 50                // grams
            },
            {
                id: 'bicycle',
                name: 'Bicycle (WienRad)',
                time: 40,
                cost: 0.80,
                co2: 0
            },
            {
                id: 'walking',
                name: 'Walking',
                time: 65,
                cost: 0,
                co2: 0
            },
            {
                id: 'lime_scooter',
                name: 'Lime Scooter',
                time: 22,
                cost: 3.50,
                co2: 15
            },
            {
                id: 'motorcycle',
                name: 'Motorcycle',
                time: 18,
                cost: 2.80,
                co2: 120
            }
        ]
    },
    {
        id: 'route2',
        name: 'Home to Airport',
        options: [
            {
                id: 'public_transport',
                name: 'Public Transportation',
                time: 55,
                cost: 8.00,
                co2: 80
            },
            {
                id: 'bicycle',
                name: 'Bicycle (WienRad)',
                time: 90,
                cost: 0.80,
                co2: 0
            },
            {
                id: 'walking',
                name: 'Walking',
                time: 150,
                cost: 0,
                co2: 0
            },
            {
                id: 'lime_scooter',
                name: 'Lime Scooter',
                time: 50,
                cost: 12.00,
                co2: 25
            },
            {
                id: 'motorcycle',
                name: 'Motorcycle',
                time: 28,
                cost: 6.50,
                co2: 180
            }
        ]
    },
    {
        id: 'route3',
        name: 'Downtown to Shopping Mall',
        options: [
            {
                id: 'public_transport',
                name: 'Public Transportation',
                time: 28,
                cost: 2.50,
                co2: 45
            },
            {
                id: 'bicycle',
                name: 'Bicycle (WienRad)',
                time: 35,
                cost: 0.80,
                co2: 0
            },
            {
                id: 'walking',
                name: 'Walking',
                time: 55,
                cost: 0,
                co2: 0
            },
            {
                id: 'lime_scooter',
                name: 'Lime Scooter',
                time: 20,
                cost: 3.00,
                co2: 12
            },
            {
                id: 'motorcycle',
                name: 'Motorcycle',
                time: 15,
                cost: 2.50,
                co2: 95
            }
        ]
    }
];

// Priority definitions with labels and attribute keys
const priorities = {
    time: { label: 'Travel Time', attribute: 'time', unit: 'min' },
    co2: { label: 'CO₂ Emissions', attribute: 'co2', unit: 'g' },
    cost: { label: 'Cost', attribute: 'cost', unit: '€' }
};

// State management
let state = {
    timerInterval: null,
    startTime: null,
    elapsedTime: 0,
    selectedPriority: null,
    currentRoute: routes[0], // Use first route by default
    firstChoice: null,
    firstChoiceTime: null,
    secondChoice: null,
    secondChoiceTime: null
};

// DOM elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    priority: document.getElementById('priority-screen'),
    firstChoice: document.getElementById('first-choice-screen'),
    secondChoice: document.getElementById('second-choice-screen'),
    results: document.getElementById('results-screen')
};

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const routeSelect = document.getElementById('route-select');

// Initialize
function init() {
    // Populate route selector
    populateRouteSelector();
    
    startBtn.addEventListener('click', startExperiment);
    restartBtn.addEventListener('click', resetExperiment);
    
    routeSelect.addEventListener('change', handleRouteChange);
    
    document.querySelectorAll('.btn-priority').forEach(btn => {
        btn.addEventListener('click', selectPriority);
    });
}

function populateRouteSelector() {
    routeSelect.innerHTML = '';
    routes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = route.name;
        routeSelect.appendChild(option);
    });
}

function handleRouteChange(e) {
    const selectedRoute = routes.find(r => r.id === e.target.value);
    if (selectedRoute) {
        state.currentRoute = selectedRoute;
    }
}

// Timer functions
function startTimer() {
    state.startTime = Date.now() - state.elapsedTime;
    state.timerInterval = setInterval(updateTimer, 100);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    state.elapsedTime = 0;
    state.startTime = null;
    updateTimerDisplay(0);
}

function updateTimer() {
    state.elapsedTime = Date.now() - state.startTime;
    updateTimerDisplay(state.elapsedTime);
}

function formatTime(milliseconds, format = 'display') {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (format === 'display') {
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${minutes}m ${seconds}s`;
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateTimerDisplay(milliseconds) {
    timerDisplay.textContent = formatTime(milliseconds, 'display');
}

function getCurrentTime() {
    return formatTime(state.elapsedTime, 'text');
}

// Navigation functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// Experiment flow functions
function startExperiment() {
    // Don't start timer yet - wait for priority selection
    showScreen('priority');
}

function selectPriority(e) {
    document.querySelectorAll('.btn-priority').forEach(btn => {
        btn.classList.remove('selected');
    });
    e.target.classList.add('selected');
    
    state.selectedPriority = e.target.dataset.priority;
    
    // Start timer AFTER priority selection
    resetTimer();
    startTimer();
    
    setTimeout(() => {
        showFirstChoiceScreen();
    }, TRANSITION_DELAY);
}

function showFirstChoiceScreen() {
    const container = document.getElementById('limited-options');
    container.innerHTML = '';
    
    // Update map route name
    document.getElementById('map-route-1').textContent = state.currentRoute.name;
    
    const priority = priorities[state.selectedPriority];
    const attribute = priority.attribute;
    
    state.currentRoute.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'mobility-option';
        optionDiv.dataset.optionId = option.id;
        
        const value = option[attribute];
        const displayValue = attribute === 'cost' ? value.toFixed(2) : value;
        
        optionDiv.innerHTML = `
            <h3>${escapeHtml(option.name)}</h3>
            <p class="info priority-info"><strong>${escapeHtml(priority.label)}:</strong> ${escapeHtml(String(displayValue))} ${escapeHtml(priority.unit)}</p>
            <p class="hidden-info">More details will be revealed in the next step</p>
        `;
        
        optionDiv.addEventListener('click', () => selectFirstChoice(option.id));
        container.appendChild(optionDiv);
    });
    
    showScreen('firstChoice');
}

function selectFirstChoice(optionId) {
    document.querySelectorAll('#limited-options .mobility-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`#limited-options .mobility-option[data-option-id="${optionId}"]`);
    selectedOption.classList.add('selected');
    
    state.firstChoice = optionId;
    state.firstChoiceTime = getCurrentTime();
    
    setTimeout(() => {
        showSecondChoiceScreen();
    }, TRANSITION_DELAY);
}

function showSecondChoiceScreen() {
    // Reset timer for second choice
    resetTimer();
    startTimer();
    
    // Update map route name
    document.getElementById('map-route-2').textContent = state.currentRoute.name;
    
    const container = document.getElementById('full-options');
    container.innerHTML = '';
    
    state.currentRoute.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'mobility-option';
        optionDiv.dataset.optionId = option.id;
        
        optionDiv.innerHTML = `
            <h3>${escapeHtml(option.name)}</h3>
            <div class="attributes-grid">
                <div class="attribute-box attribute-time">
                    <div class="label">Time</div>
                    <div class="value">${escapeHtml(String(option.time))} min</div>
                </div>
                <div class="attribute-box attribute-cost">
                    <div class="label">Cost</div>
                    <div class="value">€${escapeHtml(option.cost.toFixed(2))}</div>
                </div>
                <div class="attribute-box attribute-co2">
                    <div class="label">CO₂</div>
                    <div class="value">${escapeHtml(String(option.co2))} g</div>
                </div>
            </div>
        `;
        
        optionDiv.addEventListener('click', () => selectSecondChoice(option.id));
        container.appendChild(optionDiv);
    });
    
    showScreen('secondChoice');
}

function selectSecondChoice(optionId) {
    document.querySelectorAll('#full-options .mobility-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`#full-options .mobility-option[data-option-id="${optionId}"]`);
    selectedOption.classList.add('selected');
    
    state.secondChoice = optionId;
    state.secondChoiceTime = getCurrentTime();
    
    stopTimer();
    
    setTimeout(() => {
        showResults();
    }, TRANSITION_DELAY);
}

function showResults() {
    const firstOption = state.currentRoute.options.find(opt => opt.id === state.firstChoice);
    const secondOption = state.currentRoute.options.find(opt => opt.id === state.secondChoice);
    const choiceChanged = state.firstChoice !== state.secondChoice;
    
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `
        <div class="result-section">
            <h3>Your Priority</h3>
            <p class="result-item"><strong>Selected Priority:</strong> ${escapeHtml(priorities[state.selectedPriority].label)}</p>
        </div>
        
        <div class="result-section">
            <h3>First Choice (Limited Information)</h3>
            <p class="result-item"><strong>Choice:</strong> ${escapeHtml(firstOption.name)}</p>
            <p class="result-item"><strong>Time taken:</strong> ${escapeHtml(state.firstChoiceTime)}</p>
        </div>
        
        <div class="result-section">
            <h3>Second Choice (Full Information)</h3>
            <p class="result-item"><strong>Choice:</strong> ${escapeHtml(secondOption.name)}</p>
            <p class="result-item"><strong>Time taken:</strong> ${escapeHtml(state.secondChoiceTime)}</p>
        </div>
        
        <div class="result-section">
            <h3>Decision Analysis</h3>
            <p class="result-item">
                <strong>Choice Changed:</strong> 
                ${choiceChanged ? 'Yes' : 'No'}
                <span class="change-indicator ${choiceChanged ? 'changed' : 'unchanged'}">
                    ${choiceChanged ? 'CHANGED' : 'UNCHANGED'}
                </span>
            </p>
            ${choiceChanged ? `
                <p class="result-item"><strong>From:</strong> ${escapeHtml(firstOption.name)} → <strong>To:</strong> ${escapeHtml(secondOption.name)}</p>
            ` : ''}
        </div>
    `;
    
    showScreen('results');
}

function resetExperiment() {
    // Reset all state
    state = {
        timerInterval: null,
        startTime: null,
        elapsedTime: 0,
        selectedPriority: null,
        currentRoute: routes[0],
        firstChoice: null,
        firstChoiceTime: null,
        secondChoice: null,
        secondChoiceTime: null
    };
    
    resetTimer();
    showScreen('welcome');
}

// Initialize the app
init();
