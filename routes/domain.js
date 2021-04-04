
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

module.exports = async (req, res) => {
    let connectionString = process.env.DATABASE_URL;
    console.log('connectionString:', process.env.DATABASE_URL)


    MongoClient.connect(connectionString, {
        useUnifiedTopology: true
        }, (err, client) => {
    
            if (err) return console.error(err);
    
            console.log('Connected to Database');
            const db = client.db('xepelin');

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

    })
}