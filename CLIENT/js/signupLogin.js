const signupForm = document.getElementById('signup');
const loginForm = document.getElementById('login');

const signupNote = document.getElementById('signup-note');
const loginNote = document.getElementById('login-note');
const btnSignUp = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');

const baseURL = 'https://food-fast.herokuapp.com/api/v1';

const isValidEmail = value => /^\w+@\w+\.\w+$/.test(value);

const isValidPassword = value => /^[A-Za-z0-9]+$/.test(value);

const isLetters = value => /^[A-Za-z]+$/.test(value.trim());

const jwtDecode = (t) => {
  const token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split('.')[0]));
  token.payload = JSON.parse(window.atob(t.split('.')[1]));
  return token;
};

const goToLogin = (event) => {
  event.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
};

const goToSignup = (event) => {
  event.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
};

const displayNote = (element, value, color = 'error') => {
  element.innerText = value;
  element.style.height = '2rem';
  element.style.padding = '0.2rem';
  element.className = color;
};

const removeNote = (element) => {
  element.style.height = '0rem';
  element.style.padding = '0rem';
};

const animateBtn = (button) => {
  button.innerText = '';
  button.className = 'btn-spinner';
};

const stopBtnAnim = (button, text) => {
  button.innerText = text;
  button.className = '';
};

const fetchData = (urlPath, method, status, body = null) => {
  const token = localStorage.getItem('food-token');
  return fetch(`${baseURL}/${urlPath}`, {
    method,
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    },
  })
    .then(response => response.json())
    .then(result => (result.status === status
      ? Promise.resolve(result.data)
      : Promise.reject(result.message)));
};

const validateNewUser = (newUser) => {
  if (!isLetters(newUser.firstName)) {
    return { value: false, message: 'Invalid first name' };
  } else if (newUser.firstName.length > 40) {
    return { value: false, message: 'first name is too long' };
  } else if (!isLetters(newUser.lastName)) {
    return { value: false, message: 'Invalid last name' };
  } else if (newUser.lastName.length > 40) {
    return { value: false, message: 'last name is too long' };
  } else if (!isValidEmail(newUser.email) || newUser.email.length > 40) {
    return { value: false, message: 'Invalid Email' };
  } else if (newUser.password.length < 6) {
    return { value: false, message: 'Password is 6 characters minimum' };
  } else if (!isValidPassword(newUser.password)) {
    return { value: false, message: 'Password is alphanumeric' };
  }
  return { value: true };
};

const signup = (event) => {
  event.preventDefault();

  animateBtn(btnSignUp);

  const newUser = Object.create(null);

  newUser.firstName = signupForm.firstname.value;
  newUser.lastName = signupForm.lastname.value;
  newUser.email = signupForm.email.value;
  newUser.password = signupForm.password.value;
  const isMatch = signupForm['confirm-password'].value === newUser.password;

  const newUserValidation = validateNewUser(newUser);

  if (!newUserValidation.value || !isMatch) {
    displayNote(
      signupNote,
      newUserValidation.message || 'passwords do not match'
    );
    stopBtnAnim(btnSignUp, 'signup');
  } else {
    fetchData('auth/signup', 'POST', 201, JSON.stringify(newUser))
      .then((data) => {
        localStorage.setItem('food-token', data.token);
        window.location.replace('./home.html');
      })
      .catch((message) => {
        displayNote(signupNote, message);
        stopBtnAnim(btnSignUp, 'signup');
      });
  }
};

const login = (event) => {
  event.preventDefault();

  animateBtn(btnLogin);

  const user = Object.create(null);
  user.email = loginForm.email.value;
  user.password = loginForm.password.value;
  if (!isValidEmail(user.email) || user.email.length > 40) {
    displayNote(loginNote, 'Invalid Email');
    stopBtnAnim(btnLogin, 'login');
  } else if (user.password.length < 6) {
    displayNote(loginNote, 'Password is 6 characters minimum');
    stopBtnAnim(btnLogin, 'login');
  } else if (!isValidPassword(user.password)) {
    displayNote(loginNote, 'Password is alphanumeric');
    stopBtnAnim(btnLogin, 'login');
  } else {
    fetchData('auth/login', 'POST', 200, JSON.stringify(user))
      .then((data) => {
        localStorage.setItem('food-token', data.token);
        const decoded = jwtDecode(data.token);
        window.location.replace(decoded.payload.userRole === 'admin'
          ? './kitchen.html'
          : './home.html');
      })
      .catch((message) => {
        displayNote(loginNote, message);
        stopBtnAnim(btnLogin, 'login');
      });
  }
};

document.getElementById('to-login').addEventListener('click', goToLogin);

document.getElementById('to-signup').addEventListener('click', goToSignup);

document.querySelectorAll('#login input')
  .forEach(value => (
    value.addEventListener('input', () => removeNote(loginNote))
  ));

document.querySelectorAll('#signup input')
  .forEach(value => (
    value.addEventListener('input', () => removeNote(signupNote))
  ));

signupForm.addEventListener('submit', signup);

loginForm.addEventListener('submit', login);

window.onload = () => {
  removeNote(signupNote);
  removeNote(loginNote);
};
