const express = require('express');
const bodyParser = require('body-parser');
const store = require('data-store')({ path: process.cwd() + '/shortener.json' });
var db = require("./database.js")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/shorten', function (req, res) {
  // * Receives a POST with a url-encoded payload like this: url=http://www.xepelin.com/my-url
  // * If the URL is not registered in the system, it stores the URL along with a unique ID and the domain of the URL
  // * The server sends the ID in the response, using status code 201
  // * If the URL was already in the system, it fetches the ID and sends it with status code 208
  const {
    url
  }  = req.body;
  if (!url) {
    res.status(404).json({"error": "empty payload"});
    res.send({});
  }
  var sql = "select * from urls where url ="+ String(url);
  db.all(sql, [], (err, rows) => {
    if (err) {
      //url does not exist
      
      res.status(404).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  });
  
  
});

app.get('/:id', function (req, res) {
  // * Receives an ID, fetches the URL from an storage
  // * If it exists, return the given url
  // * If it doesn't, the server responds with status code 404
  const id = req.params.id
  var sql = "select * from urls where id ="+ String(id);
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(404).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  });
});

app.get('/domain', function (req, res) {
  // * Respond with a list of all the domains registered in the DB.
  // * The domain should not include the protocol but includes subdomains (f.e www.xepelin.com -> xepelin.com)
  var sql = "select * from urls";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(404).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  });
});


app.listen(3003, function () {
  console.log('express shortener url listening to port 3003');
});
