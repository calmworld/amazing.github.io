
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
// PATCH ORDER rout
//=================
// users.patch('users/:userId:/shoppingCart/:productId?_method=PATCH&operation=add

users.patch('users/:userId:/shoppingCart/:productId?_method=PATCH&operation=add', (req, res) => {
  //console.log("i am checking the cart")
  User.shoppingCart.update(
    { _id: req.sessions.id }, 
    { $push: { products: product } },
  )
  Product.findById(req.params.id, (err, foundProduct) => {
    console.log(foundProduct)
    res.render('users/cart.ejs', {
      product: foundProduct,
      currentUser: req.session.currentUser
      })
  })
});




//=================
// EXPORTS
//=================
module.exports = users;