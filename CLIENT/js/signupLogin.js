const signupForm = document.getElementById('signup');
const loginForm = document.getElementById('login');
const signupNote = document.getElementById('signup-note');
const loginNote = document.getElementById('login-note');
const btnSignUp = document.getElementById('btn-signup');
const btnLogin = document.getElementById('btn-login');

const baseURL = 'http://food-fast.herokuapp.com/api/v1';

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

const displayNote = (element, value, time, color = 'error') => {
  setTimeout(() => {
    element.innerText = value;
    element.style.height = '2rem';
    element.style.padding = '0.2rem';
    element.className = color;
  }, time);

  setTimeout(() => {
    element.style.height = '0rem';
    element.style.padding = '0rem';
  }, time + 2000);
};

const isValidEmail = value => /^\w+@\w+\.\w+$/.test(value);

const isValidPassword = value => /^[A-Za-z0-9]+$/.test(value);

const animateSignUpBtn = (time) => {
  btnSignUp.innerText = '';
  btnSignUp.className = 'btn-spinner';

  setTimeout(() => {
    btnSignUp.innerText = 'signup';
    btnSignUp.className = '';
  }, time);
};

const animateLoginBtn = (time) => {
  btnLogin.innerText = '';
  btnLogin.className = 'btn-spinner';

  setTimeout(() => {
    btnLogin.innerText = 'login';
    btnLogin.className = '';
  }, time);
};

const signup = (event) => {
  event.preventDefault();

  animateSignUpBtn(500);

  const newUser = Object.create(null);

  newUser.firstName = signupForm.firstname.value;
  newUser.lastName = signupForm.lastname.value;
  newUser.email = signupForm.email.value;
  newUser.password = signupForm.password.value;
  const password2 = signupForm['confirm-password'].value;
  if (newUser.firstName.length > 40) {
    displayNote(signupNote, 'first name is too long', 500);
  } else if (newUser.lastName.length > 40) {
    displayNote(signupNote, 'last name is too long', 500);
  } else if (!isValidEmail(newUser.email) || newUser.email.length > 40) {
    displayNote(signupNote, 'Invalid Email', 500);
  } else if (newUser.password.length < 6) {
    displayNote(signupNote, 'Password is 6 characters minimum', 500);
  } else if (!isValidPassword(newUser.password)) {
    displayNote(signupNote, 'Password is alphanumeric', 500);
  } else if (newUser.password !== password2) {
    displayNote(signupNote, 'Passwords do not match', 500);
  } else {
    fetch(`${baseURL}/auth/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    })
      .then(response => response.json())
      .then(result => (result.status === 201
        ? Promise.resolve(result.data)
        : Promise.reject(result.message)))
      .then((data) => {
        displayNote(signupNote, 'Successfully registered', 500, 'success');
        localStorage.setItem('food-token', data.token);
        setTimeout(() => {
          window.location.replace('./home.html');
        }, 2000);
      })
      .catch((message) => {
        displayNote(signupNote, message, 500);
      });
  }
};

const login = (event) => {
  event.preventDefault();

  animateLoginBtn(500);

  const user = Object.create(null);
  user.email = loginForm.email.value;
  user.password = loginForm.password.value;
  if (!isValidEmail(user.email) || user.email.length > 40) {
    displayNote(loginNote, 'Invalid Email', 500);
  } else if (user.password.length < 6) {
    displayNote(loginNote, 'Password is 6 characters minimum', 500);
  } else if (!isValidPassword(user.password)) {
    displayNote(loginNote, 'Password is alphanumeric', 500);
  } else {
    fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(result => (result.status === 200
        ? Promise.resolve(result.data)
        : Promise.reject(result.message)))
      .then((data) => {
        displayNote(loginNote, 'Login Successful', 500, 'success');
        localStorage.setItem('food-token', data.token);
        const decoded = jwtDecode(data.token);
        if (decoded.payload.userRole === 'admin') {
          setTimeout(() => {
            window.location.replace('./kitchen.html');
          }, 2000);
        } else {
          setTimeout(() => {
            window.location.replace('./home.html');
          }, 2000);
        }
      })
      .catch((message) => {
        displayNote(loginNote, message, 500);
      });
  }
};

document.getElementById('to-login').addEventListener('click', goToLogin);

document.getElementById('to-signup').addEventListener('click', goToSignup);

signupForm.addEventListener('submit', signup);

loginForm.addEventListener('submit', login);
