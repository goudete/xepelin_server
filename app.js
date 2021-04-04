const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid')
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

// init express app
const app = express();

// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const shorten = require('./routes/shorten');
app.post('/shorten', shorten);

const domain = require('./routes/domain');
app.get('/domain', domain);

const getUrl = require('./routes/get-url');
app.get('/:id', getUrl);

app.get('/', function (req, res) {
  console.log('welcome')
  res.json({'hola': "mundo"})
});

app.listen(3003, function () {
  console.log('chillin\' on 3003');
});
