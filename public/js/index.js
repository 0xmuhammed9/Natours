/* eslint-disable */
import { login, logout } from './login.js';
import { showAlert } from './alerts.js';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);
