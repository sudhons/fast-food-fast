const baseURL = 'https://food-fast.herokuapp.com/api/v1';
const orders = document.getElementById('orders');
const recipientDetails = document.getElementById('recipient');
const orderTotal = document.getElementById('total-order');
const orderNote = document.getElementById('order-note');
const recipientNote = document.getElementById('recipient-note');
const placeOrderBtn = document.getElementById('btn-order');
const myOrders = document.getElementById('my-orders');
const myOrderNote = document.getElementById('my-order-note');

let cartOrders = JSON.parse(localStorage.getItem('cartOrders')) || [];

const isValidName = value => /^[A-Za-z ]+$/.test(value.trim());

const isNumber = value => /^[0-9]+$/.test(value.trim());

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

const removeFromCart = (event) => {
  event.preventDefault();
  cartOrders = JSON.parse(localStorage.getItem('cartOrders')) || [];
  const element = event.target;

  const mealId = element.parentElement.getAttribute('data-id');

  orders.removeChild(event.target.parentElement.parentElement.parentElement);

  cartOrders
    .splice(cartOrders.findIndex(value => value.mealId === mealId), 1);

  localStorage.setItem('cartOrders', JSON.stringify(cartOrders));

  const btn = [...document.querySelectorAll('.item-btn')]
    .find(value => value.getAttribute('data-id') === mealId);

  if (cartOrders.length) {
    recipientDetails.style.display = 'block';
    orderTotal.innerHTML = `Total Amount: &#8358;${cartOrders
      .reduce((prev, value) => (
        prev + (value.quantity * value.mealPrice)), 0)}`;
  } else {
    orderTotal.innerText = 'Cart is Empty';
    recipientDetails.style.display = 'none';
  }

  btn.style.opacity = 1;
  btn.innerText = 'add to cart';
  btn.classList.remove('disabled');
};

const calcTotal = (event) => {
  cartOrders = JSON.parse(localStorage.getItem('cartOrders')) || [];
  const element = event.target;

  const item = cartOrders
    .find(value => value.mealId === element.getAttribute('data-id'));

  item.quantity = element.value;

  element.parentElement
    .nextElementSibling.nextElementSibling
    .lastElementChild.innerText = element.value * item.mealPrice;

  element.parentElement
    .nextElementSibling.lastElementChild.innerText = item.mealPrice;

  orderTotal.innerHTML = `Total Amount: &#8358;${cartOrders
    .reduce((prev, value) => (
      prev + (value.quantity * value.mealPrice)), 0)}`;

  localStorage.setItem('cartOrders', JSON.stringify(cartOrders));
};

const createOrderItem = (mealId, quantity, image, price, title) => {
  const orderItems = document.createElement('div');
  orderItems.setAttribute('class', 'order-items');

  const div1 = document.createElement('div');

  const heading = document.createElement('h3');
  heading.innerText = title;
  div1.appendChild(heading);

  const img = document.createElement('img');
  img.setAttribute('src', image);
  img.setAttribute('alt', 'food item picture');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', '#');
  anchor.innerHTML = '<i class="fas fa-trash">';
  anchor.setAttribute('data-id', mealId);
  anchor.addEventListener('click', removeFromCart);
  div1.appendChild(img);
  div1.appendChild(anchor);

  const div2 = document.createElement('div');
  const orderProps1 = document.createElement('div');
  orderProps1.setAttribute('class', 'my-order-props');
  const label = document.createElement('label');
  label.innerText = 'Qty:';
  const qtyInput = document.createElement('input');
  qtyInput.setAttribute('data-id', mealId);
  qtyInput.addEventListener('change', calcTotal);
  qtyInput.setAttribute('class', 'qty');
  qtyInput.setAttribute('type', 'number');
  qtyInput.setAttribute('min', 1);
  qtyInput.setAttribute('step', 1);
  qtyInput.setAttribute('value', quantity);
  orderProps1.appendChild(label);
  orderProps1.appendChild(qtyInput);
  div2.appendChild(orderProps1);

  const orderProps2 = document.createElement('div');
  orderProps2.setAttribute('class', 'my-order-props');
  const unitPrice = document.createElement('div');
  unitPrice.innerHTML = 'Unit Price: &#8358';
  const amount = document.createElement('div');
  amount.setAttribute('class', 'price');
  amount.innerText = price;
  orderProps2.appendChild(unitPrice);
  orderProps2.appendChild(amount);
  div2.appendChild(orderProps2);

  const orderProps3 = document.createElement('div');
  orderProps3.setAttribute('class', 'my-order-props');
  const total = document.createElement('div');
  total.innerHTML = 'Total: &#8358';
  const totalAmt = document.createElement('div');
  totalAmt.setAttribute('class', 'price');
  totalAmt.innerText = price * quantity;
  orderProps3.appendChild(total);
  orderProps3.appendChild(totalAmt);
  div2.appendChild(orderProps3);

  orderItems.appendChild(div1);
  orderItems.appendChild(div2);

  document.getElementById('orders').appendChild(orderItems);
};

const loadOrders = () => {
  removeNote(orderNote);
  cartOrders = JSON.parse(localStorage.getItem('cartOrders')) || [];

  if (cartOrders.length) {
    recipientDetails.style.display = 'block';
    orderTotal.innerHTML = `Total Amount: &#8358;${cartOrders
      .reduce((prev, value) => (
        prev + (value.quantity * value.mealPrice)), 0)}`;
  } else {
    orderTotal.innerText = 'Cart is Empty';
    recipientDetails.style.display = 'none';
  }

  orders.innerHTML = '';
  cartOrders
    .forEach(value => createOrderItem(
      value.mealId,
      value.quantity,
      value.mealImage,
      value.mealPrice,
      value.mealTitle
    ));
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

const addToCart = (event) => {
  event.preventDefault();
  const addBtn = event.target;
  const mealId = addBtn.getAttribute('data-id');
  const mealPrice = addBtn.getAttribute('data-price');
  const mealImage = addBtn.getAttribute('data-image');
  const mealTitle = addBtn.getAttribute('data-title');

  cartOrders.push({
    mealId,
    mealPrice,
    mealImage,
    mealTitle,
    quantity: 1,
  });

  localStorage.setItem('cartOrders', JSON.stringify(cartOrders));

  addBtn.style.opacity = 0.8;
  addBtn.innerText = 'added to cart';
  addBtn.classList.add('disabled');
};

const getMenu = () => {
  fetchData('menu', 'GET', 200)
    .then((data) => {
      cartOrders = JSON.parse(localStorage.getItem('cartOrders')) || [];
      document.getElementById('content-container')
        .classList.remove('page-spinner');
      data.forEach((value) => {
        const item = document.createElement('div');
        item.setAttribute('class', 'items');
        const title = document.createElement('h3');
        title.innerHTML = value.title;
        const anchor = document.createElement('a');
        anchor.setAttribute('href', value.image);
        const image = document.createElement('img');
        image.setAttribute('src', value.image);
        image.setAttribute('alt', 'meal picture');
        const price = document.createElement('h3');
        price.innerHTML = `Price: &#x20A6;${value.price}`;
        const button = document.createElement('button');
        button.setAttribute('class', 'item-btn');
        button.setAttribute('data-id', value.menu_id);
        button.setAttribute('data-price', value.price);
        button.setAttribute('data-image', value.image);
        button.setAttribute('data-title', value.title);
        button.innerHTML = 'add to cart';
        const isSlected = cartOrders.find(orderItem => (
          Number(orderItem.mealId) === Number(value.menu_id)
        ));
        if (isSlected) {
          button.innerText = 'added to cart';
          button.classList.add('disabled');
        }
        anchor.appendChild(image);
        item.appendChild(title);
        item.appendChild(anchor);
        item.appendChild(price);
        item.appendChild(button);
        button.addEventListener('click', addToCart);
        document.querySelector(`#${value.menu_category}s .meal-cat`)
          .appendChild(item);
      });
    })
    .catch();
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

const getOrders = () => {
  document.getElementById('user-orders').innerHTML = '';
  document.querySelector('.section-orders').style.display = 'none';
  myOrderNote.style.display = 'none';
  myOrders.classList.add('page-spinner');
  const { userId } = jwtDecode(localStorage.getItem('food-token')).payload;
  fetchData(`users/${userId}/orders`, 'GET', 200)
    .then((data) => {
      myOrders.classList.remove('page-spinner');
      if (data.length === 0) {
        myOrderNote.style.display = 'block';
      } else {
        data.forEach((value) => {
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
          document.querySelector('.section-orders').style.display = 'block';
          document.getElementById('user-orders').innerHTML += order;
          document.querySelectorAll('.fa-angle-right')
            .forEach(element => element.addEventListener('click', orderDetail));
        });
      }
    })
    .catch();
};

const animateBtn = (button) => {
  button.innerText = '';
  button.className = 'btn-spinner';
};

const stopBtnAnim = (button, text) => {
  button.innerText = text;
  button.className = '';
};

const placeOrder = (event) => {
  event.preventDefault();
  animateBtn(placeOrderBtn);

  const newOrder = Object.create(null);
  newOrder.recipientName = recipientDetails.name.value;
  newOrder.recipientAddress = recipientDetails.address.value;
  newOrder.recipientPhone = recipientDetails.phone.value;
  newOrder.order = JSON.parse(localStorage.getItem('cartOrders'))
    .reduce((result, item) => {
      const { mealId, quantity } = item;
      return [...result, { mealId, quantity }];
    }, []);

  if (!isValidName(newOrder.recipientName)) {
    displayNote(recipientNote, 'Invalid name');
    stopBtnAnim(placeOrderBtn, 'Place Order');
  } else if (newOrder.recipientName.length > 80) {
    displayNote(recipientNote, 'Name is 80 characters maximum');
    stopBtnAnim(placeOrderBtn, 'Place Order');
  } else if (newOrder.recipientAddress.length > 120) {
    displayNote(recipientNote, 'Address in 120 characters maximum');
    stopBtnAnim(placeOrderBtn, 'Place Order');
  } else if (!isNumber(newOrder.recipientPhone)) {
    displayNote(recipientNote, 'Invalid Phone number');
    stopBtnAnim(placeOrderBtn, 'Place Order');
  } else {
    fetchData('orders', 'POST', 201, JSON.stringify(newOrder))
      .then(() => {
        recipientDetails.name.value = '';
        recipientDetails.address.value = '';
        recipientDetails.phone.value = '';
        displayNote(orderNote, 'Order Successfully placed', 'success');
        stopBtnAnim(placeOrderBtn, 'Place Order');
        localStorage.removeItem('cartOrders');
        document.querySelectorAll('.fas.fa-trash')
          .forEach(item => item.click());
      })
      .catch((message) => {
        displayNote(recipientNote, message);
        stopBtnAnim(placeOrderBtn, 'Place Order');
      });
  }
};

document.getElementById('prev-orders').addEventListener('click', getOrders);

document.querySelectorAll('#recipient input')
  .forEach(value => (
    value.addEventListener('input', () => removeNote(recipientNote))
  ));

recipientDetails.addEventListener('submit', placeOrder);

document.getElementById('cart').addEventListener('click', loadOrders);

window.onload = () => {
  const token = localStorage.getItem('food-token');
  if (token) {
    getMenu();
  } else window.location.replace('/');
};

window.onload = () => {
  const token = localStorage.getItem('food-token');
  if (!token) {
    window.location.replace('/');
  } else if (jwtDecode(token).payload.userRole === 'admin') {
    document.querySelector('#nav-bar ul')
      .insertAdjacentHTML(
        'afterbegin',
        '<li><a href="kitchen.html">Kitchen</a></li>'
      );
    getMenu();
  } else if (jwtDecode(token).payload.userRole === 'customer') {
    getMenu();
  } else {
    window.location.replace('/');
  }
};
