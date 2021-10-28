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

function rowFormat(row) {
    return {
      item: row.item,
    };
}

//*************** */ ADDING HERE ****************//
// Query for inserting a new entry into the first list
service.post('/first_list', (request, response) => {

    if (request.body.hasOwnProperty('item')) {
  
      const params = [
        request.body.item,
      ];
  
      const query = 'INSERT INTO first_list(item) VALUES (?)';
  
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
            used: false,
          });
        }
      });
  
  
    } else {
  
      response.status(400);
      response.json({
        ok: false,
        results: 'Incomplete entry.',
      });
    }
  
});

// Query for inserting a new entry into the second list
service.post('/second_list', (request, response) => {

    if (request.body.hasOwnProperty('item')) {
  
      const params = [
        request.body.item,
        ];
  
      const query = 'INSERT INTO second_list(item) VALUES (?)';
  
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
            used: false,
          });
        }
      });
  
  
    } else {
  
      response.status(400);
      response.json({
        ok: false,
        results: 'Incomplete entry.',
      });
    }
  
});

// get both lists (all possible item entries)
service.get("/all", (request, response) => {

  const params = [parseInt(request.params.id)];
  const query = 'SELECT * FROM first_list';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {

      response.json({
        ok: true,
        results: rows.map(rowFormat),
        used: true,
      });
    }
  });
});

// get all item names in the first list
service.get("/first_list", (request, response) => {

  const params = "";
  const query = 'SELECT item FROM first_list';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {

      response.json({
        ok: true,
        results: rows.map(rowFormat),
      });
    }
  });
});

// get an item from the first list using the given id
service.get("/first_list/:id", (request, response) => {

    const params = [parseInt(request.params.id)];
    const query = 'SELECT * FROM first_list WHERE id = ?';
  
    connection.query(query, params, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
  
        response.json({
          ok: true,
          results: rows.map(rowFormat),
          used: true,
        });
      }
    });
  
});

// get an item from the second list using the given id
service.get("/second_list/:id", (request, response) => {

    const params = [parseInt(request.params.id)];
    const query = 'SELECT * FROM second_list WHERE id = ?';
  
    connection.query(query, params, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          used: true,
        });
      }
    });
  
});

// reset the used boolean for an item using the item id
service.patch("/first_list/:id", (request, response) => {

  const params = [parseInt(request.params.id)];
  const query = 'SELECT * FROM first_list WHERE id = ?';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
        used: false,
      });
    }
  });

});

// reset the used boolean for an item using the item id
service.patch("/second_list/:id", (request, response) => {

  const params = [parseInt(request.params.id)];
  const query = 'SELECT * FROM second_list WHERE id = ?';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
        used: false,
      });
    }
  });

});

// delete an item from the first list given the id
service.delete('/first_list/:id', (request, response) => {

  const params = [parseInt(request.params.id)];
  const query = 'DELETE FROM first_list WHERE id = ?';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
  
});

// delete an item from the second list given the id
service.delete('/second_list/:id', (request, response) => {

  const params = [parseInt(request.params.id)];
  const query = 'DELETE FROM second_list WHERE id = ?';

  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
  
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});


// curl http://localhost:5001/humans/1

// curl --header 'Content-Type: application/json' \
// --data '{"item" : "bird"}' \
// http://localhost:5001/first_list

// curl --request POST http://localhost:5001/follow/1/2

// curl http://localhost:5001/follow/1
