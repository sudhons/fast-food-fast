const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');
const menuItems = document.querySelectorAll('.menu-category-link');
const navBar = document.getElementById('nav-bar');

const jwtDecode = (t) => {
  const token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split('.')[0]));
  token.payload = JSON.parse(window.atob(t.split('.')[1]));
  return token;
};

const controlNav = (event) => {
  event.preventDefault();
  const token = localStorage.getItem('food-token');

  if (parseInt(navBar.style.height, 10) > 0) {
    navBar.style.height = '0rem';
  } else {
    navBar.style.height = (jwtDecode(token).payload.userRole === 'admin')
      ? '6.4rem'
      : '3.27rem';
  }
};

const selectItem = (event) => {
  event.preventDefault();
  const active = document.getElementById('active');
  document.querySelector('.show').classList.remove('show');
  if (active.id) active.setAttribute('id', '');

  event.target.setAttribute('id', 'active');

  const targetElement = event
    .target.innerText.toLowerCase().split(/\s+/).join('-');
  document.getElementById(targetElement).classList.add('show');
};

closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  menuBar.style.width = '0';
  openBtn.style.display = 'block';
});

openBtn.addEventListener('click', (event) => {
  event.preventDefault();
  menuBar.style.display = 'block';
  menuBar.style.width = '14rem';
  openBtn.style.display = 'none';
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('food-token');
  localStorage.removeItem('cartOrders');
});

document.getElementById('menu').addEventListener('click', controlNav);

menuItems.forEach(menuItem => menuItem.addEventListener('click', selectItem));
