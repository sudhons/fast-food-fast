const navBar = document.getElementById('nav-bar');


const controlNav = (e) => {
  e.preventDefault();
  
  if(navBar.style.display === 'block') {
    navBar.style.display = 'none';
  } else {
    navBar.style.display = 'block';
  }
};


document.getElementById('menu').addEventListener('click', controlNav);

// window.onload = controlNav;