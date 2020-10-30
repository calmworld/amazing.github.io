//===========================
// Dependencies
//===========================
const express = require('express'); //include the express package
const app = express();

const mongoose = require('mongoose'); //include the mongoose package

const productsController = require('./controllers/products.js'); //require controllers/routs from products.js

//===========================
// Port
//===========================
const port = 3000;


//==============================
// Global Configuration
//==============================
const mongoURI = 'mongodb://localhost:27017/amazing' //configure mongoURI with db called amazing

//configure mongoose Promise: mongoose.Promise = global.Promise //Optional - may or may not get a warning in terminal about this


//============================
// Connect to Mongoose
//============================
mongoose.connect(mongoURI, { 
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.connection.once('open', () => {
    console.log('Established Connection With Mongod');
})

//===========================
// Middleware
//===========================
app.use(express.json()); //allows us to recognize the incoming request as a JSON object.

//body-parser
//extended: true - has to do with how the data is being parsed (and what kind can be parsed). Always set it to true - as a good rule of thumb
app.use(express.urlencoded({extended: true})); //recognize the incoming object as strings or arrays.

//tells express to try to match requests with files in the directory called 'public' for CSS purposes
app.use(express.static(__dirname + '/public')); 


app.use('/products', productsController); //use routs/controllers from products.js

//===========================
// Listening
//===========================
app.listen(port, () => {
    console.log('Running on port: ', port)
})