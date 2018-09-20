[![Build Status](https://travis-ci.org/sudhons/fast-food-fast.svg?branch=feature-api-endpoints-160445750)](https://travis-ci.org/sudhons/fast-food-fast)
[![Coverage Status](https://coveralls.io/repos/github/sudhons/fast-food-fast/badge.svg?branch=feature-api-endpoints-160445750)](https://coveralls.io/github/sudhons/fast-food-fast?branch=feature-api-endpoints-160445750)
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

## Features

* Users can view signup and signin pages
* Users can view meals
* Users can make orders
* Users can view histories of previous orders
* Admin can accept, decline or complete orders

## Installation and Setup

* Install [NodeJs](https://nodejs.org/en) and [Git](https://git-scm.com/downloads) on your computer.
* Using `Git` command-line, Clone the git repository: `git clone https://github.com/sudhons/fast-food-fast`.
* Navigate into the cloned repository: `cd fast-food-fast`.
* Install dependencies: `npm install`.
* Start the application:`npm start`.

## Tests

* To run tests: `npm run test`.

## Style

* Eslint
* Airbnb

## Endpoints

<table>
  <tr><th>HTTP verbs</th><th>Route Endpoints</th><th>Function</th><th>Request Payload</th></tr>
<tr><td>GET</td><td>/api/v1/orders</td><td>Gets all orders</td><td>None</td></tr>
<tr><td>POST</td><td>/api/v1/orders</td><td>Posts a new order</td><td>
{

    "recipientName": <string>,
    "recipientAddress": <string>,
    "recipientPhone": <number>,
	"order": [
      {"mealId": <number>, "quantity": <number>},
      {"mealId": <number>, "quantity": <number>}
    ]
}
</td></tr>
<tr><td>GET</td><td>/api/v1/orders/:orderId</td><td>Gets an order</td><td>None</td></tr>
<tr><td>PUT</td><td>/api/v1/orders/:orderId </td><td> Updates an order's status</td><td>
{

	"status": "accepted"  
}

Accepted values of status: `accepted`, `waiting`, `completed`, `declined`</td></tr>
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
