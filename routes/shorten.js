const { nanoid } = require('nanoid')
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

module.exports = async (req, res) => {
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

    let connectionString = process.env.DATABASE_URL;
    

    MongoClient.connect(connectionString, (err, client) => {

        if (err) return console.error(err);

        console.log('Connected to Database');
        const db = client.db('xepelin');
        const urlCollection = db.collection('urls');

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

    })

}