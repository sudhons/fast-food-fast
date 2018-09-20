const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');

const orderDetail = (event) => {
  event.preventDefault();
  const orderDetailSection = event
    .target.parentElement.parentElement.nextElementSibling;
  if (orderDetailSection.style.height === '25rem') {
    orderDetailSection.style.height = '';
  } else {
    orderDetailSection.style.height = '25rem';
  }
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

document.querySelectorAll('.show-order')
  .forEach(element => element.addEventListener('click', orderDetail));
