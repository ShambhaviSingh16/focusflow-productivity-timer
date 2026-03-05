document.addEventListener('DOMContentLoaded', () => {
    // ---- Constants & Variables ----
    const FOCUS_TIME = 25 * 60; // 25 minutes
    const BREAK_TIME = 5 * 60;  // 5 minutes

    let timeLeft = FOCUS_TIME;
    let timerId = null;
    let isFocusMode = true;
    let isRunning = false;
    let totalFocusSeconds = 0;
    let completedSessions = 0;

    const motivationalMessages = [
        "Stay focused, you can do this!",
        "Every minute counts.",
        "Keep going, you're doing great!",
        "Block out the noise, find your flow.",
        "Deep work brings deep results.",
        "One task at a time."
    ];

    // ---- DOM Elements ----
    const timeLeftDisplay = document.getElementById('time-left');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const focusBtn = document.getElementById('focus-btn');
    const breakBtn = document.getElementById('break-btn');
    const messageDisplay = document.getElementById('message');
    const progressCircle = document.querySelector('.progress-ring__circle');

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    const completedSessionsDisplay = document.getElementById('completed-sessions');
    const totalFocusTimeDisplay = document.getElementById('total-focus-time');

    // Circle progress properties
    const circleRadius = progressCircle.r.baseVal.value;
    const circleCircumference = circleRadius * 2 * Math.PI;
    progressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    progressCircle.style.strokeDashoffset = circleCircumference;

    function setProgress(percent) {
        const offset = circleCircumference - (percent / 100) * circleCircumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    // ---- Timer Functions ----
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeLeftDisplay.textContent = formatTime(timeLeft);
        const totalTime = isFocusMode ? FOCUS_TIME : BREAK_TIME;
        const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
        setProgress(progressPercent);
        document.title = `${formatTime(timeLeft)} - FocusFlow`;
    }

    function changeMessage() {
        if (isFocusMode && isRunning) {
            const randomMsg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            messageDisplay.textContent = randomMsg;
        } else if (!isFocusMode) {
            messageDisplay.textContent = "Take a breather, you earned it!";
        } else {
            messageDisplay.textContent = "Ready to focus? Let's go!";
        }
    }

    function updateStats() {
        completedSessionsDisplay.textContent = completedSessions;
        const totalMinutes = Math.floor(totalFocusSeconds / 60);
        totalFocusTimeDisplay.textContent = `${totalMinutes}m`;
    }

    function handleTimerComplete() {
        clearInterval(timerId);
        isRunning = false;
        timerId = null;

        if (isFocusMode) {
            completedSessions++;
            updateStats();
            alert('Focus session completed! Time for a break.');
            setBreakMode();
        } else {
            alert('Break finished! Ready to focus?');
            setFocusMode();
        }
    }

    function startTimer() {
        if (isRunning) return;

        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        changeMessage();

        timerId = setInterval(() => {
            timeLeft--;
            if (isFocusMode) {
                totalFocusSeconds++;
                if (totalFocusSeconds % 60 === 0) updateStats(); // update stats every minute
            }
            updateDisplay();

            if (timeLeft <= 0) {
                handleTimerComplete();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;

        clearInterval(timerId);
        isRunning = false;
        timerId = null;

        startBtn.disabled = false;
        pauseBtn.disabled = true;
        messageDisplay.textContent = "Timer paused.";
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = isFocusMode ? FOCUS_TIME : BREAK_TIME;
        updateDisplay();
        messageDisplay.textContent = "Ready to focus? Let's go!";
        setProgress(0);
    }

    function setFocusMode() {
        isFocusMode = true;
        focusBtn.classList.add('active');
        breakBtn.classList.remove('active');
        progressCircle.setAttribute('stroke', '#4f46e5'); // primary color
        resetTimer();
    }

    function setBreakMode() {
        isFocusMode = false;
        breakBtn.classList.add('active');
        focusBtn.classList.remove('active');
        progressCircle.setAttribute('stroke', '#10b981'); // success color
        resetTimer();
    }

    // ---- Task Functions ----
    function createTaskElement(taskText) {
        const li = document.createElement('li');
        li.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-task-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        });

        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const taskEl = createTaskElement(text);
            taskList.appendChild(taskEl);
            taskInput.value = '';
        }
    }

    // ---- Event Listeners ----
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    focusBtn.addEventListener('click', setFocusMode);
    breakBtn.addEventListener('click', setBreakMode);

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initialize display
    updateDisplay();
    setProgress(0);
});
