
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

module.exports = async (req, res) => {
    let connectionString = process.env.DATABASE_URL;

    MongoClient.connect(connectionString, {
        useUnifiedTopology: true
        }, (err, client) => {
    
            if (err) return console.error(err);
    
            console.log('Connected to Database');
            const db = client.db('xepelin');

            // Query db
            db.collection('urls').find().toArray().then(
            (results) => {
    
            
            let domains = {};

            results.forEach( (d) => domains[d.domain.substring(4)] = [] )
            results.forEach( (d) => domains[d.domain.substring(4)].push(d.urlPathName) );

            res.json({ domains })
            }
        ).catch(error => console.error(error));

    })
}