import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// selecting the form
const form = document.querySelector('.form');

// listening for form submit
form.addEventListener('submit', event => {
  event.preventDefault();

  // getting values from form (i.e. accessing inputs by name => form.elements), i.e. user input
  const delay = Number(form.elements.delay.value); // converting to number
  const state = form.elements.state.value;

  // creating promise
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // handling promise outcome
  promise
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`, // showing resolve outcome notification instead of console.log/alert
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`, // showing reject outcome notification instead of console.log/alert
        position: 'topRight',
      });
    });
});
