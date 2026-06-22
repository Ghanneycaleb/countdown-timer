/* =========================
   DOM ELEMENT SELECTION
   ========================= */

// Input fields
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

// Timer display and message area
const timerDisplay = document.getElementById("timerDisplay");
const statusMessage = document.getElementById("statusMessage");

// Buttons
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");

/* =========================
   TIMER STATE VARIABLES
   ========================= */

// Stores the countdown interval ID returned by setInterval
let countdownInterval = null;

// Remaining time in seconds while timer is running or paused
let remainingTimeInSeconds = 0;

// Original time entered by the user, used for Reset
let originalTimeInSeconds = 0;

/* =========================
   HELPER FUNCTIONS
   ========================= */

/**
 * Converts a total number of seconds into HH:MM:SS format.
 * Example: 3661 -> "01:01:01"
 */
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Updates the timer display on the page.
 */
function updateDisplay(totalSeconds) {
  timerDisplay.textContent = formatTime(totalSeconds);
}

/**
 * Reads the user's input values and converts them to total seconds.
 * If an input is empty, it is treated as 0.
 */
function getInputTimeInSeconds() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;

  return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Updates the status message text shown below the timer display.
 */
function setStatus(message) {
  statusMessage.textContent = message;
}

/**
 * Enables or disables buttons based on the current timer state.
 */
function setButtonState({ start, pause, resume, reset }) {
  startBtn.disabled = start;
  pauseBtn.disabled = pause;
  resumeBtn.disabled = resume;
  resetBtn.disabled = reset;
}

/**
 * Stops the timer interval if it exists.
 * This prevents multiple intervals from running at once.
 */
function stopTimerInterval() {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

/* =========================
   TIMER ACTION FUNCTIONS
   ========================= */

/**
 * Starts the countdown timer.
 */
function startTimer() {
  // Prevent multiple intervals from starting
  stopTimerInterval();

  // Get the total time from inputs
  const totalSeconds = getInputTimeInSeconds();

  // Validate the entered time
  if (totalSeconds <= 0) {
    setStatus("Please enter a valid time greater than 0.");
    alert("Please enter a valid time greater than 0.");
    return;
  }

  // Save original time for Reset
  originalTimeInSeconds = totalSeconds;
  remainingTimeInSeconds = totalSeconds;

  // Update the display immediately
  updateDisplay(remainingTimeInSeconds);
  setStatus("Timer started.");

  // Update button states
  setButtonState({
    start: true,
    pause: false,
    resume: true,
    reset: false
  });

  // Start the countdown
  countdownInterval = setInterval(() => {
    remainingTimeInSeconds--;

    updateDisplay(remainingTimeInSeconds);

    // If timer reaches zero, stop it
    if (remainingTimeInSeconds <= 0) {
      stopTimerInterval();
      remainingTimeInSeconds = 0;
      updateDisplay(0);
      setStatus("Time’s up!");

      // When time is up, only Start is enabled again
      setButtonState({
        start: false,
        pause: true,
        resume: true,
        reset: false
      });
    }
  }, 1000);
}

/**
 * Pauses the current countdown without losing the remaining time.
 */
function pauseTimer() {
  // Only pause if the timer is currently running
  if (countdownInterval !== null) {
    stopTimerInterval();
    setStatus("Timer paused.");

    setButtonState({
      start: true,
      pause: true,
      resume: false,
      reset: false
    });
  }
}

/**
 * Resumes the countdown from the remaining time.
 */
function resumeTimer() {
  // Do nothing if there is no time left
  if (remainingTimeInSeconds <= 0) {
    setStatus("There is no paused timer to resume.");
    return;
  }

  // Prevent multiple intervals
  stopTimerInterval();

  setStatus("Timer resumed.");

  setButtonState({
    start: true,
    pause: false,
    resume: true,
    reset: false
  });

  countdownInterval = setInterval(() => {
    remainingTimeInSeconds--;

    updateDisplay(remainingTimeInSeconds);

    if (remainingTimeInSeconds <= 0) {
      stopTimerInterval();
      remainingTimeInSeconds = 0;
      updateDisplay(0);
      setStatus("Time’s up!");

      setButtonState({
        start: false,
        pause: true,
        resume: true,
        reset: false
      });
    }
  }, 1000);
}

/**
 * Resets the timer to the originally entered time.
 */
function resetTimer() {
  stopTimerInterval();

  // If there was no original time, reset display to 00:00:00
  if (originalTimeInSeconds <= 0) {
    remainingTimeInSeconds = 0;
    updateDisplay(0);
    setStatus("Enter a time above, then click Start.");

    setButtonState({
      start: false,
      pause: true,
      resume: true,
      reset: true
    });

    return;
  }

  // Restore the original time
  remainingTimeInSeconds = originalTimeInSeconds;
  updateDisplay(remainingTimeInSeconds);
  setStatus("Timer reset to the original time.");

  setButtonState({
    start: false,
    pause: true,
    resume: true,
    reset: false
  });
}

/* =========================
   EVENT LISTENERS
   ========================= */

// Start button click
startBtn.addEventListener("click", startTimer);

// Pause button click
pauseBtn.addEventListener("click", pauseTimer);

// Resume button click
resumeBtn.addEventListener("click", resumeTimer);

// Reset button click
resetBtn.addEventListener("click", resetTimer);

/* =========================
   INITIAL PAGE STATE
   ========================= */

// Show 00:00:00 when the page first loads
updateDisplay(0);

// Initial button state:
// Start enabled, Pause disabled, Resume disabled, Reset disabled
setButtonState({
  start: false,
  pause: true,
  resume: true,
  reset: true
});
