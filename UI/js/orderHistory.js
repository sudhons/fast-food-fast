const orderDetail = (e) => {
  e.preventDefault();
  const orderDetailSection = e.target.parentElement.parentElement.nextElementSibling;
  if (orderDetailSection.style.height === '25rem') {
    orderDetailSection.style.height = '';
  } else {
    orderDetailSection.style.height = '25rem';
  }
};

document.querySelectorAll('.show-order')
  .forEach(element => element.addEventListener('click', orderDetail));
