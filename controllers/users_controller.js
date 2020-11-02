
//===========================
// DEPENDENCIES
//===========================
const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();

//=================
// Models
//=================
const User = require('../models/users.js');

const methodOverride = require('method-override'); //include the method-override package
users.use(methodOverride('_method'));
//===========================
// ROUTS
//===========================

//=================
// NEW USER rout
//=================
users.get('/new', (req, res) => {
  res.render('users/new.ejs', {
    currentUser: req.session.currentUser
  })
});


//=================
// CREATE USER rout
//=================
users.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, (err, createdUser) => {
    console.log('user is created', createdUser)
    res.redirect('/')
  });
});



//=================
// USER CART rout
//=================
users.get('/cart', (req, res) => {
  console.log(req.session.currentUser)
  User.find({username: req.session.username}, (err, user) => {
    //console.log(user)
    res.render('users/cart.ejs', { currentUser: req.session.currentUser, products: req.session.currentUser.shoppingCart})
  })
});


//=================
// PATCH ORDER rout
//=================
// users.patch('users/:userId:/shoppingCart/:productId?_method=PATCH&operation=add

users.patch('/:userId/products/:productId', (req, res) => {
  console.log("i am checking the cart")
  User.findByIdAndUpdate(req.params.userId, { 
    $push: { products: req.params.productId }
  })
  res.redirect('/users/cart')
})


//=================
// EXPORTS
//=================
module.exports = users;