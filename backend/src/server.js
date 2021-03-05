// initialisation
const path = require('path');
const {inject, errorHandler} = require('express-custom-error');
const express = require("express");
const app = express();
const db = require(path.resolve(__dirname, 'database/mongo'))
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())


//define db specific routes
app.use('/users', require(path.resolve(__dirname, 'routes/users')));


app.listen(5000, () => console.log(`running on ${5000}`))

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: 404, message: 'Endpoint Not Found'} );
})


// // Patches
// const {inject, errorHandler} = require('express-custom-error');
// inject(); // Patch express in order to use async / await syntax

// // Require Dependencies

// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const helmet = require('helmet');
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path')
// const dbPath = path.resolve(__dirname, '/db/ixon.db')

// let db = new sqlite3.Database('ixon');

//   db.serialize(() => {
//     db.run("CREATE TABLE user (id INT, name TEXT")
//   })

// const logger = require('./util/logger');

// // Load .env Enviroment Variables to process.env

// // require('mandatoryenv').load([
// //     'DB_HOST',
// //     'DB_DATABASE',
// //     'DB_USER',
// //     'DB_PASSWORD',
// //     'PORT',
// //     'SECRET'
// // ])

// const { PORT } = process.env || 5000;


// // Instantiate an Express Application
// const app = express();


// // Configure Express App Instance
// app.use(express.json( { limit: '50mb' } ));
// app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// // Configure custom logger middleware
// app.use(logger.dev, logger.combined);

// app.use(cookieParser());
// app.use(cors());
// app.use(helmet());

// // This middleware adds the json header to every response
// app.use('*', (req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     next();
// })

// // Assign Routes

// app.use('/', require('./routes/router.js'));


// // Handle errors
// app.use(errorHandler());

// // Handle not valid route
// app.use('*', (req, res) => {
//     res
//     .status(404)
//     .json( {status: false, message: 'Endpoint Not Found'} );
// })

// // Open Server on selected Port
// app.listen(
//     5000,
//     () => console.info('Server listening on port ', 5000)
// );