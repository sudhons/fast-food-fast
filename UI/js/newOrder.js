const menuItems = document.querySelectorAll('.menu-category-link');

const addItemBtns = document.querySelectorAll('.item-btn');

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

const addToOrder = (event) => {
  event.preventDefault();
  const addBtn = event.target;

  if (addBtn.innerText === 'add to order') {
    addBtn.innerText = 'added';
    addBtn.style.opacity = 0.8;
  } else {
    addBtn.innerText = 'add to order';
    addBtn.style.opacity = 1;
  }
};

menuItems.forEach(menuItem => menuItem.addEventListener('click', selectItem));

addItemBtns.forEach(btn => btn.addEventListener('click', addToOrder));

