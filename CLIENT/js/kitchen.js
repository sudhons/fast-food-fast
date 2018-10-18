const addMealForm = document.getElementById('new-meal');
const addMealBtn = document.getElementById('btn-add');
const menuNote = document.getElementById('menu-note');
const imageBtn = document.getElementById('meal-image');
const imageView = document.getElementById('image');
const imageLabel = document.getElementById('image-label');
const content = document.getElementById('content-container');
const newOrdersNote = document.getElementById('new-orders-note');
const processingOrdersNote = document.getElementById('processing-orders-note');
const cancelledOrdersNote = document.getElementById('cancelled-orders-note');
const completedOrdersNote = document.getElementById('completed-orders-note');
const newSectionOrders = document.querySelector('#new-orders .section-orders');
const processingSectionOrders = document
  .querySelector('#processing-orders .section-orders');
const cancelledSectionOrders = document
  .querySelector('#cancelled-orders .section-orders');
const completedSectionOrders = document
  .querySelector('#completed-orders .section-orders');


const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/sudhons/upload';
const CLOUDINARY_PRESET = 'hzzmreyc';

const baseURL = 'https://food-fast.herokuapp.com/api/v1';

const isValidTitle = value => /^[A-Za-z ]+$/.test(value.trim());

const isNumber = value => /^[1-9][0-9]+$/.test(value);

const displayNote = (element, value, color = 'error') => {
  element.innerText = value;
  element.style.height = '2rem';
  element.style.padding = '0.2rem';
  element.className = color;
};

const removeNote = (element) => {
  element.style.height = '0rem';
  element.style.padding = '0rem';
};

const animateBtn = (button) => {
  button.innerText = '';
  button.classList.add('btn-spinner');
};

const stopBtnAnim = (button, text) => {
  button.innerText = text;
  button.classList.remove('btn-spinner');
};

const fetchData = (urlPath, method, status, body = null) => {
  const token = localStorage.getItem('food-token');
  return fetch(`${baseURL}/${urlPath}`, {
    method,
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token
    },
  })
    .then(response => response.json())
    .then(result => (result.status === status
      ? Promise.resolve(result.data)
      : Promise.reject(result.message)));
};

const addNewMenu = (event) => {
  event.preventDefault();

  animateBtn(addMealBtn);

  const newMeal = Object.create(null);

  newMeal.title = addMealForm.title.value;
  newMeal.price = addMealForm.price.value;
  newMeal.image = addMealForm.image.src;
  newMeal.category = addMealForm.category.value;

  if (!isValidTitle(newMeal.title)) {
    displayNote(menuNote, 'Title is letters only');
    stopBtnAnim(addMealBtn, 'add');
  } else if (newMeal.length > 30) {
    displayNote(menuNote, 'Title is too long');
    stopBtnAnim(addMealBtn, 'add');
  } else if (!isNumber(newMeal.price)) {
    displayNote(menuNote, 'Price is a numer');
    stopBtnAnim(addMealBtn, 'add');
  } else {
    fetchData('menu', 'POST', 201, JSON.stringify(newMeal))
      .then(() => {
        addMealForm.title.value = '';
        addMealForm.price.value = '';
        addMealForm['meal-image'].value = '';
        addMealForm.image.src = '/';
        displayNote(menuNote, 'Menu Item added', 'success');
        stopBtnAnim(addMealBtn, 'add');
      })
      .catch((message) => {
        displayNote(menuNote, message);
        stopBtnAnim(addMealBtn, 'add');
      });
  }
};

const orderDetail = (event) => {
  event.preventDefault();
  const orderDetailSection = event
    .target.parentElement.parentElement.nextElementSibling;
  if (orderDetailSection.style.height === '20rem') {
    orderDetailSection.style.height = '';
    event.target.style.transform = 'rotate(0deg)';
  } else {
    orderDetailSection.style.height = '20rem';
    event.target.style.transform = 'rotate(90deg)';
  }
};

const getOrderPropsRow = (propsName, propsValue) => `<tr>
    <th class="order-props">${propsName}</th>
    <td class="order-props-val ${propsName === 'Status:' ? propsValue : ''}">
      ${propsValue}
    </td>
  </tr>`;

const getItemRow = ({
  title,
  quantity,
  unit_price: unitPrice,
  total
}) => `<tr>
      <td>${title}</td>
      <td>${quantity}</td>
      <td>${unitPrice}</td>
      <td>${total}</td>
    </tr>`;

const getOrderAmtTable = value => `<table class="order-amount">
    <thead>
      <tr>
        <th>Meal</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${value.items
    .reduce((combined, item) => `${combined} ${getItemRow(item)}`, '')}
    </tbody>
    <tfoot>
      <tr>
        <th colspan="3">Order Total</th>
        <th>${value.total_amount}</th>
      </tr>
    </tfoot>
  </table>`;

const getOrderDataTable = value => `<table class="order-data">
  ${getOrderPropsRow('Order ID:', value.order_id)}
  ${getOrderPropsRow('Status:', value.order_status)}
  ${getOrderPropsRow('Customer:', value.customer)}
  ${getOrderPropsRow('Recipient Name:', value.recipient_name)}
  ${getOrderPropsRow('Recipient Address:', value.recipient_address)}
  ${getOrderPropsRow('Recipient Phone Number:', value.recipient_phone)}
  ${getOrderPropsRow(
    'Date:',
    `${new Date(value.ordered_time).toDateString()}`
  )}
</table>`;

const completeOrder = (event) => {
  event.preventDefault();
  const orderId = event.target.getAttribute('data-id');
  const status = { status: 'completed' };
  animateBtn(event.target);
  fetchData(`orders/${orderId}`, 'PUT', 200, JSON.stringify(status))
    .then((value) => {
      event.target.parentElement.parentElement.parentElement.remove();
      if (!document.querySelector('#processing-orders .admin-orders')
        .hasChildNodes()) {
        processingOrdersNote.style.display = 'block';
        processingSectionOrders.style.display = 'none';
      }
      completedOrdersNote.style.display = 'none';
      completedSectionOrders.style.display = 'block';
      const order = `<li>
  <div class="order-table">
    <div class="show-order">
      <i class="fas fa-angle-right"></i>
        <span>${value.order_id}</span>
    </div>
    <div class="date">
        <span>${new Date(value.ordered_time).toDateString()}</span>
    </div>
    <div class="${value.order_status}">
        <span>${value.order_status}</span>
      </div>  
  </div>
  <div class="order-detail">
    ${getOrderAmtTable(value)}
    ${getOrderDataTable(value)}
  </div>
</li>`;
      document.querySelector(`#${value.order_status}-orders .admin-orders`)
        .innerHTML += order;
      document.querySelectorAll('.fa-angle-right')
        .forEach(element => element.addEventListener('click', orderDetail));
    });
};

const acceptOrder = (event) => {
  event.preventDefault();
  const orderId = event.target.getAttribute('data-id');
  const status = { status: 'processing' };
  animateBtn(event.target);
  fetchData(`orders/${orderId}`, 'PUT', 200, JSON.stringify(status))
    .then((value) => {
      event.target.parentElement.parentElement.parentElement.remove();
      if (!document.querySelector('#new-orders .admin-orders')
        .hasChildNodes()) {
        newOrdersNote.style.display = 'block';
        newSectionOrders.style.display = 'none';
      }
      processingOrdersNote.style.display = 'none';
      processingSectionOrders.style.display = 'block';
      const order = `<li>
  <div class="order-table">
    <div class="show-order">
      <i class="fas fa-angle-right"></i>
        <span>${value.order_id}</span>
    </div>
    <div class="date">
      <span>${new Date(value.ordered_time).toDateString()}</span>
    </div>
    <div class="complete">
      <a class="status-btn" data-id="${value.order_id}" href="#">Complete</a>
    </div>
  </div>
  <div class="order-detail">
    ${getOrderAmtTable(value)}
    ${getOrderDataTable(value)}
  </div>
</li>`;
      document.querySelector(`#${value.order_status}-orders .admin-orders`)
        .innerHTML += order;
      document.querySelectorAll(' .complete a')
        .forEach(btn => btn.addEventListener('click', completeOrder));
      document.querySelectorAll('.fa-angle-right')
        .forEach(element => element.addEventListener('click', orderDetail));
    });
};

const declineOrder = (event) => {
  event.preventDefault();
  const orderId = event.target.getAttribute('data-id');
  const status = { status: 'cancelled' };
  animateBtn(event.target);
  fetchData(`orders/${orderId}`, 'PUT', 200, JSON.stringify(status))
    .then((value) => {
      event.target.parentElement.parentElement.parentElement.remove();
      if (!document.querySelector('#new-orders .admin-orders')
        .hasChildNodes()) {
        newOrdersNote.style.display = 'block';
        newSectionOrders.style.display = 'none';
      }
      cancelledOrdersNote.style.display = 'none';
      cancelledSectionOrders.style.display = 'block';
      const order = `<li>
    <div class="order-table">
      <div class="show-order">
        <i class="fas fa-angle-right"></i>
          <span>${value.order_id}</span>
      </div>
      <div class="date">
          <span>${new Date(value.ordered_time).toDateString()}</span>
      </div>
      <div class="${value.order_status}">
          <span>${value.order_status}</span>
        </div>  
    </div>
    <div class="order-detail">
      ${getOrderAmtTable(value)}
      ${getOrderDataTable(value)}
    </div>
  </li>`;
      document.querySelector(`#${value.order_status}-orders .admin-orders`)
        .innerHTML += order;
      document.querySelectorAll('.fa-angle-right')
        .forEach(element => element.addEventListener('click', orderDetail));
    });
};

const adminGetOrders = () => {
  document.getElementById('new-orders').classList.add('page-spinner');
  document.querySelectorAll('.admin-orders')
    .forEach((value) => {
      value.innerHTML = '';
    });
  newOrdersNote.style.display = 'none';
  processingOrdersNote.style.display = 'none';
  cancelledOrdersNote.style.display = 'none';
  completedOrdersNote.style.display = 'none';
  newSectionOrders.style.display = 'none';
  processingSectionOrders.style.display = 'none';
  cancelledSectionOrders.style.display = 'none';
  completedSectionOrders.style.display = 'none';
  fetchData('orders', 'GET', 200)
    .then((data) => {
      document.getElementById('new-orders').classList.remove('page-spinner');
      data.forEach((value) => {
        const order = `<li>
  <div class="order-table">
    <div class="show-order">
      <i class="fas fa-angle-right"></i>
        <span>${value.order_id}</span>
    </div>
    ${(() => {
    if (value.order_status === 'processing') {
      return `<div class="date">
          <span>${new Date(value.ordered_time).toDateString()}</span>
        </div>
        <div class="complete">
          <a class="status-btn" data-id="${value.order_id}" href="#">Complete</a>
        </div>
        `;
    } else if (value.order_status === 'new') {
      return `<div class="accept">
          <a class="status-btn" data-id="${value.order_id}" href="#">Accept</a>
        </div>
        <div class="decline">
          <a class="status-btn" data-id="${value.order_id}" href="#">Decline</a>
        </div>
        `;
    }
    return `<div class="date">
          <span>${new Date(value.ordered_time).toDateString()}</span>
        </div>
        <div class="${value.order_status}">
          <span>${value.order_status}</span>
        </div>
        `;
  })()}
  </div>
  <div class="order-detail">
    ${getOrderAmtTable(value)}
    ${getOrderDataTable(value)}
  </div>
</li>`;
        document.querySelector(`#${value.order_status}-orders .admin-orders`)
          .innerHTML += order;
      });
      document.querySelectorAll('.fa-angle-right')
        .forEach(element => element.addEventListener('click', orderDetail));
      if (document.querySelector('#new-orders .admin-orders').hasChildNodes()) {
        newSectionOrders.style.display = 'block';
      } else {
        newOrdersNote.style.display = 'block';
      }
      if (document.querySelector('#processing-orders .admin-orders')
        .hasChildNodes()) {
        processingSectionOrders.style.display = 'block';
      } else {
        processingOrdersNote.style.display = 'block';
      }
      if (document.querySelector('#cancelled-orders .admin-orders')
        .hasChildNodes()) {
        cancelledSectionOrders.style.display = 'block';
      } else {
        cancelledOrdersNote.style.display = 'block';
      }
      if (document.querySelector('#completed-orders .admin-orders')
        .hasChildNodes()) {
        completedSectionOrders.style.display = 'block';
      } else {
        completedOrdersNote.style.display = 'block';
      }
      document.querySelectorAll(' .accept a')
        .forEach(btn => btn.addEventListener('click', acceptOrder));
      document.querySelectorAll(' .decline a')
        .forEach(btn => btn.addEventListener('click', declineOrder));
      document.querySelectorAll(' .complete a')
        .forEach(btn => btn.addEventListener('click', completeOrder));
    });
};

imageBtn.addEventListener('change', (event) => {
  animateBtn(imageLabel);
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: formData
  }).then((result) => {
    imageView.src = result.data.secure_url;
    stopBtnAnim(imageLabel, 'Choose Image');
  });
});

addMealForm.addEventListener('submit', addNewMenu);

document.getElementById('new-menu')
  .addEventListener('click', removeNote(menuNote));

document.querySelectorAll('#new-meal input')
  .forEach(value => (
    value.addEventListener('input', () => removeNote(menuNote))
  ));

document.getElementById('all-orders')
  .addEventListener('click', adminGetOrders);

window.onload = () => {
  const token = localStorage.getItem('food-token');
  if (!token) {
    window.location.replace('/');
  } else if (jwtDecode(token).payload.userRole === 'admin') {
    content.classList.remove('page-spinner');
    adminGetOrders();
  } else if (jwtDecode(token).payload.userRole === 'customer') {
    window.location.replace('home.html');
  } else {
    window.location.replace('/');
  }
};
