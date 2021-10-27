const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();
service.use(express.json());

service.use((request, response, next) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.set("Access-Control-Allow-Headers", "Content-Type");

  next();
});

service.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

//*************** */ ADDING HERE ****************//
// Query for inserting a new row into database (Date Given)
service.post('/', (request, response) => {

    if (request.body.hasOwnProperty('username') &&
      request.body.hasOwnProperty('screen_name')) {
  
      const params = [
        request.body.username,
        request.body.screen_name,
      ];
  
      const query = 'INSERT INTO humans(username, screen_name) VALUES (?, ?)';
  
      connection.query(query, params, (error, result) => {
        if (error) {
          response.status(500);
          response.json({
            ok: false,
            results: error.message,
          });
        } else {
          response.json({
            ok: true,
            results: result.insertId,
          });
        }
      });
  
  
    } else {
  
      response.status(400);
      response.json({
        ok: false,
        results: 'Incomplete expenses data.',
      });
    }
  
  });

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});


// curl http://localhost:5001/humans/1

// curl --header 'Content-Type: application/json' \
// --data '{"username": "user", "screen_name": "name"}' \
// http://localhost:5001/humans

// curl --request POST http://localhost:5001/follow/1/2

// curl http://localhost:5001/follow/1
