// importing libraries (i.e. flatpickr (datetime picker UI) & iziToast (popup notifications))
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// selecting html elements
const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// setting initial state of the button & input field
// the button starts disabled (i.e. the user must pick first the date)
startBtn.disabled = true;
let userSelectedDate = null; // to store the data chosen by the user
let timerId = null; // used to stop the timer

// setting up the date picker => flatpickr
const options = {
  enableTime: true, // showing time picker along with the date, i.e. allows time selection
  time_24hr: true, // using 24h format
  defaultDate: new Date(), // opening on today's date
  minuteIncrement: 1, // setting increment of 1 min

  // runs when the user closes the calendar
  onClose(selectedDates) {
    const selectedDate = selectedDates[0]; // selectedDates is an array of the choosen dates, here the first selected date is taken

    if (selectedDate <= new Date()) {
      startBtn.disabled = true; // validating the date, i.e. it should be not in the past or now (current date)

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = selectedDate; // if valid, saving the chosen date and allowing the user to start (pressing be button to launch countdown)
    startBtn.disabled = false;
  },
};

flatpickr(input, options); // initializing countdown (i.e. flatpickr)

// handling event (button click)
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  // locking the button & input while counting down to prevent changes while timer runs
  startBtn.disabled = true;
  input.disabled = true;

  // running code every 1 sec
  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now; // time difference b/w current date and choosen date in mil secs

    // if countdown finished
    if (diff <= 0) {
      clearInterval(timerId); // stopping the timer
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // showing 00:00:00:00;

      input.disabled = false; // unlocking input
      startBtn.disabled = true; // keeping the button disabled
      return;
    }

    const time = convertMs(diff); // converting time (mis secs) difference
    updateTimer(time); // updating display
  }, 1000);
});

// converting mil secs into d, h, m, s
// function convertMs() returns object with calculated time remaining to the choosen date
// number of milliseconds per unit of time
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day); // remaining total full d
  const hours = Math.floor((ms % day) / hour); // remaining h
  const minutes = Math.floor(((ms % day) % hour) / minute); // remaining m
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); // remaining s

  return { days, hours, minutes, seconds };
}

// addLeadingZero => formatting helper
function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // enshuring string has a given length, i.e. the numbers have 2 digits
}

// updating timer & updating the display (by taking the time object and putting the foramtted numbers into the HTML spans )
function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}
