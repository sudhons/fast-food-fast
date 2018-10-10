const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');
const menuItems = document.querySelectorAll('.menu-category-link');

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

menuItems.forEach(menuItem => menuItem.addEventListener('click', selectItem));
