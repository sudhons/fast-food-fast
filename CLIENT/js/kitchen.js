const addMealForm = document.getElementById('new-meal');
const addMealBtn = document.getElementById('btn-add');
const menuNote = document.getElementById('menu-note');
const imageBtn = document.getElementById('meal-image');
const imageView = document.getElementById('image');
const imageLabel = document.getElementById('image-label');
const content = document.getElementById('content-container');

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/sudhons/upload';
const CLOUDINARY_PRESET = 'hzzmreyc';

const baseURL = 'http://food-fast.herokuapp.com/api/v1';

const jwtDecode = (t) => {
  const token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split('.')[0]));
  token.payload = JSON.parse(window.atob(t.split('.')[1]));
  return token;
};

const isValidTitle = value => /^[A-Za-z ]+$/.test(value.trim());

const isNumber = value => /^[1-9][0-9]+$/.test(value);

const displayNote = (element, value, color = 'error') => {
  element.innerText = value;
  element.style.height = '2rem';
  element.style.padding = '0.2rem';
  element.className = color;

  setTimeout(() => {
    element.style.height = '0rem';
    element.style.padding = '0rem';
  }, 2000);
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

const addNewMenu = (event) => {
  event.preventDefault();

  animateBtn(addMealBtn);

  const newMeal = Object.create(null);

  newMeal.title = addMealForm.title.value;
  newMeal.price = addMealForm.price.value;
  newMeal.image = addMealForm.image.src;
  newMeal.category = addMealForm.category.value;

  if (!isValidTitle(newMeal.title)) {
    displayNote(menuNote, 'Title is letters only');
    stopBtnAnim(addMealBtn, 'add');
  } else if (newMeal.length > 30) {
    displayNote(menuNote, 'Title is too long');
    stopBtnAnim(addMealBtn, 'add');
  } else if (!isNumber(newMeal.price)) {
    displayNote(menuNote, 'Price is a numer');
    stopBtnAnim(addMealBtn, 'add');
  } else {
    fetchData('menu', 'POST', 201, JSON.stringify(newMeal))
      .then(() => {
        addMealForm.title.value = '';
        addMealForm.price.value = '';
        addMealForm['meal-image'].value = '';
        addMealForm.image.src = '/';
        displayNote(menuNote, 'Menu Item added', 'success');
        stopBtnAnim(addMealBtn, 'add');
      })
      .catch((message) => {
        displayNote(menuNote, message);
        stopBtnAnim(addMealBtn, 'add');
      });
  }
};

imageBtn.addEventListener('change', (event) => {
  animateBtn(imageLabel);
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: formData
  }).then((result) => {
    imageView.src = result.data.secure_url;
    stopBtnAnim(imageLabel, 'Choose Image');
  });
});

addMealForm.addEventListener('submit', addNewMenu);

window.onload = () => {
  const token = localStorage.getItem('food-token');
  const decoded = jwtDecode(token);
  if (decoded.payload.userRole !== 'admin') {
    window.location.replace('/');
  }
  content.classList.remove('page-spinner');
};

