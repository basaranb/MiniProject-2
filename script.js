// Mobility options data
const mobilityOptions = [
    {
        id: 'car',
        name: 'Personal Car',
        time: '20 minutes',
        co2: '150g CO₂',
        transfers: 0,
        limitedInfo: 'Direct route to destination'
    },
    {
        id: 'bus',
        name: 'Bus',
        time: '35 minutes',
        co2: '50g CO₂',
        transfers: 1,
        limitedInfo: 'Public transport option'
    },
    {
        id: 'metro',
        name: 'Metro + Walk',
        time: '28 minutes',
        co2: '30g CO₂',
        transfers: 0,
        limitedInfo: 'Rail-based transport'
    },
    {
        id: 'bike',
        name: 'Bicycle',
        time: '40 minutes',
        co2: '0g CO₂',
        transfers: 0,
        limitedInfo: 'Active mobility option'
    }
];

// State management
let state = {
    timerInterval: null,
    startTime: null,
    elapsedTime: 0,
    priority: null,
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

// Initialize
function init() {
    startBtn.addEventListener('click', startExperiment);
    restartBtn.addEventListener('click', resetExperiment);
    
    document.querySelectorAll('.btn-priority').forEach(btn => {
        btn.addEventListener('click', selectPriority);
    });
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

function updateTimerDisplay(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getCurrentTime() {
    const totalSeconds = Math.floor(state.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
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
    startTimer();
    showScreen('priority');
}

function selectPriority(e) {
    document.querySelectorAll('.btn-priority').forEach(btn => {
        btn.classList.remove('selected');
    });
    e.target.classList.add('selected');
    
    state.priority = e.target.dataset.priority;
    
    setTimeout(() => {
        showFirstChoiceScreen();
    }, 500);
}

function showFirstChoiceScreen() {
    const container = document.getElementById('limited-options');
    container.innerHTML = '';
    
    mobilityOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'mobility-option';
        optionDiv.dataset.optionId = option.id;
        
        optionDiv.innerHTML = `
            <h3>${option.name}</h3>
            <p class="info">${option.limitedInfo}</p>
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
    }, 500);
}

function showSecondChoiceScreen() {
    // Reset timer for second choice
    resetTimer();
    startTimer();
    
    const container = document.getElementById('full-options');
    container.innerHTML = '';
    
    mobilityOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'mobility-option';
        optionDiv.dataset.optionId = option.id;
        
        optionDiv.innerHTML = `
            <h3>${option.name}</h3>
            <p class="info"><strong>Time:</strong> ${option.time}</p>
            <p class="info"><strong>CO₂ Emissions:</strong> ${option.co2}</p>
            <p class="info"><strong>Transfers:</strong> ${option.transfers}</p>
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
    }, 500);
}

function showResults() {
    const firstOption = mobilityOptions.find(opt => opt.id === state.firstChoice);
    const secondOption = mobilityOptions.find(opt => opt.id === state.secondChoice);
    const choiceChanged = state.firstChoice !== state.secondChoice;
    
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `
        <div class="result-section">
            <h3>Your Priority</h3>
            <p class="result-item"><strong>Selected Priority:</strong> ${getPriorityLabel(state.priority)}</p>
        </div>
        
        <div class="result-section">
            <h3>First Choice (Limited Information)</h3>
            <p class="result-item"><strong>Choice:</strong> ${firstOption.name}</p>
            <p class="result-item"><strong>Time taken:</strong> ${state.firstChoiceTime}</p>
        </div>
        
        <div class="result-section">
            <h3>Second Choice (Full Information)</h3>
            <p class="result-item"><strong>Choice:</strong> ${secondOption.name}</p>
            <p class="result-item"><strong>Time taken:</strong> ${state.secondChoiceTime}</p>
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
                <p class="result-item"><strong>From:</strong> ${firstOption.name} → <strong>To:</strong> ${secondOption.name}</p>
            ` : ''}
        </div>
    `;
    
    showScreen('results');
}

function getPriorityLabel(priority) {
    const labels = {
        'time': 'Time',
        'co2': 'CO₂ Emissions',
        'transfers': 'Number of Transfers'
    };
    return labels[priority] || priority;
}

function resetExperiment() {
    // Reset all state
    state = {
        timerInterval: null,
        startTime: null,
        elapsedTime: 0,
        priority: null,
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
