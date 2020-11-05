
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

const Product = require('../models/products.js');

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
users.get('/cart', (req, res, next) => {
  //console.log(req.session.currentUser)
  let userCart = []
  User.find().populate('products').exec({username: req.session.username}, (err, user) => {
    //console.log(user)
    // let userCart = []
    let shoppingCart = req.session.currentUser.shoppingCart
    for (let i = 0; i < shoppingCart.length; i++) {
      console.log("test")
        Product.findById(shoppingCart[i], (err, item) => {
          //console.log(item)
          userCart.push(item)
          console.log(userCart)
          return userCart
        })
        // console.log(userCart)
    }
  //   res.render('users/cart.ejs', { currentUser: req.session.currentUser, userCart: userCart, products: Product.find()})
 })
 res.render('users/cart.ejs', { currentUser: req.session.currentUser, userCart: userCart, products: Product.find()})
});


//=================
// PATCH Cart rout
//=================
users.patch('/:userId/products/:productId', (req, res) => {
  User.findByIdAndUpdate(req.params.userId, {productId: req.params.productId}, (err, user) => {
    //console.log("hello")
    // console.log(user)
    //user.shoppingCart.push(req.params.productId)
    //user.save()
    //console.log(user)
    // Product.findById(req.params.productId, (err, item) => {
    //   //console.log('test')
    //   //console.log(product)
    //   userCart.push(item)
    //   userCart.save()
    //   //console.log(user)
    // })
  })
  Product.findByIdAndUpdate(req.params.productId, {$inc: {'qty': -1}}, (err) => {
    if (err) {
        console.log(err)
    } else {
        res.redirect(`/products/${req.params.productId}`)
    }
})
  // res.redirect('/users/cart')
})
//========


//=================
// EXPORTS
//=================
module.exports = users;



