const baseURL = 'http://food-fast.herokuapp.com/api/v1';

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

const getMenu = () => {
  fetchData('menu', 'GET', 200)
    .then((data) => {
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
        price.innerHTML = `Price: N${value.price}`;
        const button = document.createElement('button');
        button.setAttribute('class', 'item-btn');
        button.setAttribute('dataId', value.menu_id);
        button.innerHTML = 'add to order';
        anchor.appendChild(image);
        item.appendChild(title);
        item.appendChild(anchor);
        item.appendChild(price);
        item.appendChild(button);
        document.querySelector(`#${value.menu_category}s .meal-cat`)
          .appendChild(item);
      });
    })
    .catch();
};

window.onload = getMenu();
