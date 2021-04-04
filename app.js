const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid')
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');


// init express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Mongodb
let connectionString = 'mongodb+srv://enrique:xepelin@cluster0.rnoiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
MongoClient.connect(connectionString, {
  useUnifiedTopology: true
}, (err, client) => {

  if (err) return console.error(err);

  console.log('Connected to Database');
  const db = client.db('xepelin');
  const urlCollection = db.collection('urls');


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
      return
    }

    // parse url
    let parseUrl = new URL(url);
    let domain = parseUrl.hostname;
    let urlPathName = parseUrl.pathname;

    // Check if it exists in db
    db.collection('urls').find().toArray().then(
      (results) => {
        let existingUrl = results.find( (r) => String(r.urlPathName) === String(urlPathName) );

        if (existingUrl) {
          return res.status(208).json({ existingUrl })
        } else {
          let uniqueID = nanoid();
          // insert into db
          urlCollection.insertOne({domain, urlPathName, uniqueID})

          return res.status(201).json({'id': uniqueID})
        }
      }
    ).catch(error => console.error(error));
  });

  app.get('/domain', function (req, res) {
    // * Respond with a list of all the domains registered in the DB.
    // * The domain should not include the protocol but includes subdomains (f.e www.xepelin.com -> xepelin.com)

    // Query db
    db.collection('urls').find().toArray().then(
      (results) => {

        // store all domains in array
        let domains = results.map((d) => d.domain);
        // remove duplicates
        domains = _.uniq(domains);

        // remove protocol
        domains = domains.map( (d) => d.substring(4) )
        res.json({ domains })
      }
    ).catch(error => console.error(error));

  });

  app.get('/:id', function (req, res) {
    // * Receives an ID, fetches the URL from an storage
    // * If it exists, return the given url
    // * If it doesn't, the server responds with status code 404
    const id = req.params.id

    db.collection('urls').find().toArray().then(
      (results) => {

        let existingID = results.find( (r) => r.uniqueID === String(id) )

        if (existingID) {
          return res.status(208).json({ existingID })
        } else {
          return res.status(404).json({'message': 'id does not exist'})
        }
      }
    ).catch(error => console.error(error));

  });


})

app.get('/', function (req, res) {
  console.log('welcome')
  res.json({'hola': "mundo"})
});


app.listen(3003, function () {
  console.log('express shortener url listening to port 3003');
});
