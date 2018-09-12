const menuItems = document.querySelectorAll('.menu-category-link');
const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');

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

menuItems.forEach(menuItem => menuItem.addEventListener('click', selectItem));