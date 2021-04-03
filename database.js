var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url text, 
            domain text,
            )`,
            (err) => {
                if (err) {
                    console.log(err)
                }else{
                   
                }
        });  
    }
});


module.exports = db