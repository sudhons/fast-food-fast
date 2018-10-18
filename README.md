[![Build Status](https://travis-ci.org/sudhons/fast-food-fast.svg?branch=develop)](https://travis-ci.org/sudhons/fast-food-fast)
[![Coverage Status](https://coveralls.io/repos/github/sudhons/fast-food-fast/badge.svg?branch=develop)](https://coveralls.io/github/sudhons/fast-food-fast?branch=develop)
[![GitHub](https://img.shields.io/github/license/sudhons/fast-food-fast.svg)](https://github.com/sudhons/fast-food-fast/blob/develop/LICENSE.txt)


# fast-food-fast
Fast-Food-Fast is a food ordering and delivery application for a restaurant.

## Table of Contents
* [Tasks](#tasks)
* [Features](#features)
* [Installation and Setup](#installation-and-setup)
* [Tests](#tests)
* [Style](#style)
* [Endpoints](#endpoints)
* [Technologies and Frameworks](#technologies-and-frameworks)
* [Author](#author)

## Tasks

* [Pivotal Tracker Board](https://www.pivotaltracker.com/n/projects/2196419)
* [User Interface Templates](https://sudhons.github.io/fast-food-fast/)
* [API on Heroku](https://food-fast.herokuapp.com/api/v1)
* [Swagger Documentation](https://food-fast.herokuapp.com/api-docs)
* [Complete Application](https://food-fast.herokuapp.com)

## Features

* Users can signup for an account
* Users can login into their accounts
* Users see available menu options
* Users can add desired menu items to cart
* Users can make orders
* Users can see his/her previous orders
* Admin can accept, decline or complete orders
* Admin can add new menu items

## Installation and Setup

* Install [NodeJs](https://nodejs.org/en) and [Git](https://git-scm.com/downloads) on your computer.
* Using `Git` command-line, Clone the git repository: `git clone https://github.com/sudhons/fast-food-fast`.
* Navigate into the cloned repository: `cd fast-food-fast`.
* Create a `.env` file at the root folder. Enter your database details in this format: `DATABASE_URL=<Your database URL>` and setup JSON webtoken secret:
`JWT_KEY=<jsonwebtoken>`.
* Install dependencies: `npm install`.
* Start the application: `npm start`.

## Tests

* To run tests: `npm run test`.

## Style

* Eslint
* Airbnb

## Endpoints

<table>
  <tr><th>HTTP verbs</th><th>Route Endpoints</th><th>Function</th><th>Request Payload</th></tr>
<tr><td>POST</td><td>/api/v1/auth/signup</td><td>Registers a new user</td><td>

    "firstName": <string>,
    "lastName": <string>,
    "email": <string>,
    "password": <string>

</td></tr>
<tr><td>POST</td><td>/api/v1/auth/login</td><td>Logs in a user</td><td>

    "email": <string>,
    "password": <string>

</td></tr>
<tr><td>GET</td><td>/api/v1/menu</td><td>Gets all menu items</td><td>None</td></tr>
<tr><td>GET</td><td>/api/v1/menu/:menuId</td><td>Gets a menu item</td><td>None</td></tr>
<tr><td>POST</td><td>/api/v1/menu</td><td>Posts a new menu item</td><td>

    "title": <string>,
    "price": <number>,
    "image": <string>
    "category": <string>
  Accepted category values : `meals`, `drinks`, and `desserts`
</td></tr>
<tr><td>GET</td><td>/api/v1/orders</td><td>Gets all orders</td><td>None</td></tr>
<tr><td>POST</td><td>/api/v1/orders</td><td>Posts a new order</td><td>
	
    "recipientName": <string>,
    "recipientAddress": <string>,
    "recipientPhone": <number>,
	"order": [
      {"mealId": <number>, "quantity": <number>},
      {"mealId": <number>, "quantity": <number>}
    ]
    
</td></tr>
<tr><td>GET</td><td>/api/v1/orders/:orderId</td><td>Gets an order</td><td>None</td></tr>
<tr><td>PUT</td><td>/api/v1/orders/:orderId </td><td> Updates an order's status</td><td>

	"status": "processing"  

Accepted values of status: `new`, `processing`, `cancelled`, and `completed`</td></tr>
</table>

## Technologies and Frameworks

- HTML
- CSS
- JavaScript
- NodeJS
- ExpressJS
- Mocha
- Chai
- Chai-http
- Babel

## Author

[Oluwaseun Jolaoso](https://github.com/sudhons)
