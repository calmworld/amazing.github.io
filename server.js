//===========================
// Dependencies
//===========================
const express = require('express'); //include the express package

const mongoose = require('mongoose'); //include the mongoose package

const session = require('express-session');

const morgan = require('morgan');

const token = require('jsonwebtoken')
//==============================
// Global Configuration
//==============================
//const mongoURI = 'mongodb://localhost:27017/amazing' //configure mongoURI with db called amazing

//configure mongoose Promise: mongoose.Promise = global.Promise //Optional - may or may not get a warning in terminal about this
//===============================
require('dotenv').config()

const app = express();

const db = mongoose.connection

const port = process.env.PORT

const mongodbURI = process.env.MONGODBURI

//==============================
/// MIDDLEWARE
//==============================
app.use(express.json()); //allows us to recognize the incoming request as a JSON object.

//body-parser
//extended: true - has to do with how the data is being parsed (and what kind can be parsed). Always set it to true - as a good rule of thumb
app.use(express.urlencoded({extended: true})); //recognize the incoming object as strings or arrays.

//tells express to try to match requests with files in the directory called 'public' for CSS purposes
app.use(express.static(__dirname + '/public')); 

// use session
app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
)

// use morgan
app.use(morgan('dev'))

//============================
// DATABASE -- Connect to Mongoose
//============================
mongoose.connect(mongodbURI, { 
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
},
() => {
  console.log('the connection with mongod is established at', mongodbURI)
}
)

//===========================
// ERROR
//===========================
// Optional, but likely helpful
// Connection Error/Success
// Define callback functions for various events
db.on('error', err => console.log(err.message + ' is mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))

//===========================
// Controllers
//===========================
const productsController = require('./controllers/products_controller.js'); //require controllers/routs from products.js
app.use('/products', productsController); //use routs/controllers from products.js

const usersController = require('./controllers/users_controller.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)

const ordersController = require('./controllers/orders_controller.js')
app.use('/orders', ordersController)

//===========================
// Routes
//===========================
// localhost:3000  - this will reroute to `products
app.get('/', (req, res) => {
    res.redirect('/products')
})

// 404 errors!
// this will catch any route that doesn't exist
app.get('*', (req, res) => {
  res.render('./index.ejs')
})

//===========================
// Listening
//===========================
app.listen(port, () => {
    console.log('Running on port: ', port)
})