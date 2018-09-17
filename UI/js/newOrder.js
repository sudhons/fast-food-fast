const menuItems = document.querySelectorAll('.menu-category-link');
const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');

const selectItem = (e) => {
  e.preventDefault();
  const active = document.getElementById('active');
  document.querySelector('.show').className = '';
  if (active.id) active.setAttribute('id', '');

  e.target.setAttribute('id', 'active');
  switch (e.target.innerText) {
  case 'Meals':
    document.getElementById('meals').className = 'show';
    break;
  case 'Drinks':
    document.getElementById('drinks').className = 'show';
    break;
  case 'Desserts':
    document.getElementById('desserts').className = 'show';
    break;
  case 'My order':
    document.getElementById('my-order').className = 'show';
    break;
  case 'Previous orders':
    document.getElementById('previous-orders').className = 'show';
    break;
  case 'New Orders':
    document.getElementById('new-orders').className = 'show';
    break;
  case 'Accepted Orders':
    document.getElementById('accepted-orders').className = 'show';
    break;
  case 'Declined Orders':
    document.getElementById('declined-orders').className = 'show';
    break;
  case 'Completed Orders':
    document.getElementById('completed-orders').className = 'show';
    break;
  case 'Add New Food':
    document.getElementById('add-new-food').className = 'show';
    break;
  default:
    break;
  }
};

closeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  menuBar.style.width = '0';
  openBtn.style.display = 'block';
});

openBtn.addEventListener('click', (e) => {
  e.preventDefault();
  menuBar.style.display = 'block';
  menuBar.style.width = '14rem';
  openBtn.style.display = 'none';
});

menuItems.forEach(menuItem => menuItem.addEventListener('click', selectItem));
