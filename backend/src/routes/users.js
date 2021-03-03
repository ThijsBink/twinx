const users = require('express').Router();
const path = require('path')
const db = require(path.resolve(__dirname, '../database/db'));

// You can require and use your routes here ;)

// Define the index return method. App relates to express and the .get means GET request
users.get("/", (req, res) => {
   new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", (error, rows) => {
         if (error) {
            reject(error)
         } else {
            resolve(rows)
         }
      }); 
   }).then(value => {
      console.log(value)
      res.status(200).json(value)
   }).catch(err => {
      console.log(err)
      res.status(500).json(err)
   })
});

users.get("/:id", (req, res) => {
   new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ${req.params.id}`, (error, rows) => {
         if (error) {
            reject(error)
         } else {
            resolve(rows)
         }
      }); 
   }).then(value => {
      // if the query was succesful, it needs to be checked whether the row actually exists, if not, an error should be thrown
      if (value === undefined) {
         value = {}
      //    throw {status : 404, message: `User with uid ${req.params.id} does not exist`}
      }
      res.status(200).json(value)
   }).catch(err => {
      // in case an error pops up during the querying of the database, it will be caught here and returned as response
      res.status(404).json(err)
   })
});

users.post("", (req, res) => {
   new Promise((resolve, reject) => {
      db.run(`INSERT INTO users VALUES (null, '${req.body.name}'); `, function(error) {
         if (error) {
            reject(error)
         } else {
            resolve({id : this.lastID, name : req.body.name})
         }
      }); 
   }).then(value => {
      console.log(value)
      res.status(201).json(value)
   }).catch(err => {
      console.log(err)
      res.status(500).json(err)
   })
});


module.exports = users;