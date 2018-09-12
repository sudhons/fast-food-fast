const navBar = document.getElementById('nav-bar');

const controlNav = (e) => {
  e.preventDefault();
  
  if(navBar.style.height === '6.4rem') {
    navBar.style.height = '0';
  } else {
    navBar.style.height = '6.4rem';
  }
};


document.getElementById('menu').addEventListener('click', controlNav);