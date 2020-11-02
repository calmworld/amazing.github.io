//===========================
// DEPENDENCIES
//===========================
const express = require('express'); //include the express package

const orders = express.Router();

//=================
// Models
//=================
const Order = require('../models/orders.js');
const Product = require('../models/products');


//=================
// Authentication
//=================
const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
      return next()
    } else {
      res.redirect('/sessions/new')
    }
}

//=================
// See Json Route
//=================
// orders.get('/json', async (req, res) => {
//     try {
//       const orders = await Product.find()
//       res.send(orders)
//     } catch (err) {
//       res.send(err.message)
//     }
// })


//===========================
// ROUTS
//===========================

//=================
// SHOW rout
//=================
orders.get('/:id', isAuthenticated, (req, res) => {
    console.log(req.session.currentUser)
    Product.findById(req.params.id, (err, foundProduct) => {
        console.log(foundProduct)
        res.render('products/show.ejs', {
            product: foundProduct,
            currentUser: req.session.currentUser
        })
    })
})

//===================================
// orders.get('/:id', async (req, res) => {
//     try {
//       const order = await Order.findById(req.params.id)
//       res.render('./orders/show.ejs', { order: order })
//     } catch (err) {
//       res.send('That isn\'t a valid id! <a href="/products">Go back</a>')
//     }
// })

//====================================
