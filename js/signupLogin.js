const signupDiv = document.getElementById('signup');
const loginDiv = document.getElementById('login');

const goToLogin = (event) => {
  event.preventDefault();
  signupDiv.style.display = 'none';
  loginDiv.style.display = 'block';
}

const goToSignup = (event) => {
  event.preventDefault();
  loginDiv.style.display = 'none';
  signupDiv.style.display = 'block';
}

document.getElementById('to-login').addEventListener('click', goToLogin);

document.getElementById('to-signup').addEventListener('click', goToSignup);

window.onload = goToSignup;
