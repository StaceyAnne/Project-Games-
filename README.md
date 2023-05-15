# Northcoders House of Games API

This project serves as a backend for a board games review application. The project is a RESTful API, providing the review data. 

The project is built using Ecpress.js and PSQL. 

## Instructions

### 1. Node.js

You will need to ensure that you have Node.js (version 19.6.0). 
 *[download here](https://nodejs.org/en/download)*


### 2. Postgres 

You will need to ensure that you have Postgres installed (version 14.6). *[download here](https://www.postgresql.org/download)*

### 3. Installation 

1. To clone this repo, use the command: git clone https://github.com/StaceyAnne/Project-Games-.git
2. Install the dependencies using the command 'npm install" 

## .ENV Files

You will need to create two .env files for this project: 

* .env.test: PGDATABASE=nc_games_test
* .env.development: PGDATABASE=nc_games


## Testing

This project was built using TDD. To run the tests you will need to the below: 

* 'npm install -D jest jest-sorted supertest'

To run the tests use: 'npm test'


## Hosting

The hosted API can be found here: https://nc-games-1onq.onrender.com

