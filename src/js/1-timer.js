import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');
let timerInterval = null;
let userSelectedDate = null;

// Flatpickr options
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
        timeout: 3000,
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Initialize flatpickr
flatpickr(dateTimePicker, options);

// Convert ms to days, hours, minutes, seconds
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Add leading zero
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Start countdown
function startCountdown(endTime) {
  timerInterval = setInterval(() => {
    const now = new Date();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      updateTimer(0, 0, 0, 0);
      iziToast.success({
        title: "Completed",
        message: "Countdown finished!",
        position: "topRight",
        timeout: 3000,
      });
      startButton.disabled = true;
      dateTimePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
}

// Update timer display
function updateTimer(days, hours, minutes, seconds) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

// Start button click handler
startButton.addEventListener("click", () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;
  startCountdown(userSelectedDate);
});