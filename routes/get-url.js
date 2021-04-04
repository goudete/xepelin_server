
const MongoClient = require('mongodb').MongoClient
var _ = require('lodash');

module.exports = async (req, res) => {
    let connectionString = 'mongodb+srv://enrique:xepelin@cluster0.rnoiz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

    MongoClient.connect(connectionString, {
        useUnifiedTopology: true
        }, (err, client) => {

            if (err) return console.error(err);

            console.log('Connected to Database');
            const db = client.db('xepelin');
    
            const id = req.params.id
            console.log('id:', id)

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

    })
}