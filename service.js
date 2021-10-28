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

// get all item info in both lists
service.get("/all", (request, response) => {

  const params = "";
  const query = 'SELECT item, id, used FROM first_list, second_list';

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

// get all item names in the second list
service.get("/second_list", (request, response) => {

  const params = "";
  const query = 'SELECT item FROM second_list';

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

// GET FUNCTIONS
// curl http://localhost:5001/first_list/1
// curl http://localhost:5001/second_list/4
// curl http://localhost:5001/first_list
// curl http://localhost:5001/second_list
// curl http://localhost:5001/all

// POST CURL FUNCTION ( to test, change the item name and which list you want to add to)
// curl --header 'Content-Type: application/json' \
// --data '{"item" : "bird"}' \
// http://localhost:5001/first_list

