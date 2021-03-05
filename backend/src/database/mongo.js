var MongoClient = require('mongodb').MongoClient;
const mongoUser = "TwinxJotem"
const mongoPass = "W55RUsYTMjt9AKAl"
const url = `mongodb+srv://${mongoUser}:${mongoPass}@jotemapp.sdide.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const mongo = MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

module.exports = mongo;