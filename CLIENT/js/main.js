const navBar = document.getElementById('nav-bar');
const closeBtn = document.getElementById('close');
const menuBar = document.getElementById('menu-bar');
const openBtn = document.querySelector('.fa-caret-square-down');


const controlNav = (event) => {
  event.preventDefault();

  if (navBar.style.height === '3.27rem') {
    navBar.style.height = '0';
  } else {
    navBar.style.height = '3.27rem';
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

document.getElementById('menu').addEventListener('click', controlNav);
