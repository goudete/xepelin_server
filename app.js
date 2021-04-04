const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid')
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

// init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// endpoints
app.get('/', function (req, res) {
  console.log('welcome')
  res.json({'hola': "mundo"})
});

const shorten = require('./routes/shorten');
app.post('/shorten', shorten);

const domain = require('./routes/domain');
app.get('/domain', domain);

const getUrl = require('./routes/get-url');
app.get('/:id', getUrl);


app.listen(process.env.PORT || 3003, () => {
  console.log('chillin\' on 3003');
});
