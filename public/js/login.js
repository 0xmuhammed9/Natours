/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login', 
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response.data.message || 'Error logging in! Please try again.'
    );
  }
};

// Move this to index.js or keep it here if you want it to run immediately
document.querySelector('.form--login')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
