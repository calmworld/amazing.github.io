
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
  //  console.log(req.session.currentUser)
  let userCart = []
  User.find().populate('products').exec({username: req.session.username}, (err, user) => {
    //  console.log(user)
    //  let userCart = []
    let shoppingCart = req.session.currentUser.shoppingCart
    for (let i = 0; i < shoppingCart.length; i++) {
      console.log("test")
       let item = Product.findById(shoppingCart[i], (err, item) => {
        console.log(userCart)
        })
        userCart.push(item)
    }
    let allItems = Promise.all(userCart).then(items => {
      console.log(items)
      res.render('users/cart.ejs', { currentUser: req.session.currentUser, userCart: items, products: Product.find()})
    })
    console.log(allItems)

  })
});



//=================
// PATCH /cart rout
//=================
users.patch('/:userId/products/:productId', (req, res) => {
  User.findByIdAndUpdate(req.params.userId, {productId: req.params.productId}, (err, user) => {
  })
  Product.findByIdAndUpdate(req.params.productId, {$inc: {'qty': -1}}, (err) => {
    if (err) {
        console.log(err)
    } else {
        res.redirect(`/products/${req.params.productId}`)
    }
  })
})



//=================
// DELETE /cart rout
//=================
// users.delete('/cart/:id', (req, res) => {
//   User.findByIdAndUpdate(req.params.id, (err, deletedItem) => {
//       res.redirect('/users/cart');
//   })
// });


//=================
// EXPORTS
//=================
module.exports = users;