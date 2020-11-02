//===========================
// DEPENDENCIES
//===========================
const express = require('express'); //include the express package

const router = express.Router();

const methodOverride = require('method-override'); //include the method-override package
//===========================
// MODELS
//===========================
//this logic gives us access to the car data in the models directory
const Product = require('../models/products.js');
const productSeed = require('../models/seed.js');
//console.log('productSeed')


//===========================
// MIDDLEWARE
//===========================
//after app has been defined //use methodOverride.
//We'll be adding a query parameter to our delete form named _method
router.use(methodOverride('_method'));

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


//===========================
// ROUTS
//===========================

//=================
// SEED rout
//=================
router.get('/seed', (req, res) => {
    Product.remove(() => {
        Product.create(productSeed, (err, data) => {
            if (err) console.log(err.message);
            console.log('added provided seed data')
            res.redirect('/products/');
        })
    })
})


//=================
// INDEX rout
//=================
router.get('/', (req, res) => {
    Product.find((err, allProducts) => {
        //console.log(allProducts)
        //console.log(req.session.currentUser)
        res.render('products/index.ejs', {
            //gives all product data a var name
            products: allProducts,
            currentUser: req.session.currentUser
        })
    })
})
//==========
// router.get('/', (req, res) => {
//     Product.find((err, allProducts) => {
//         //console.log(allProducts)
//         //console.log(req.session.currentUser)
//         let shoppingCart = [];
//         let cartSize = 3;
//         for (let i = 0; i < allProducts.length; i += cartSize) {
//             shoppingCart.push(allProducts.slice(i, i + cartSize));
//         }
//         res.render('products/index.ejs', 
//         {title: 'Shopping Cart', products: cartSize}, 
//         {
//             //gives all product data a var name
//             products: allProducts,
//             currentUser: req.session.currentUser
//         })
//     })
// })

//=================
// NEW rout
//=================
router.get('/new', isAuthenticated, (req, res) => {
    res.render('products/new.ejs', {currentUser: req.session.currentUser}
    )
})


//=================
// POST/CREATE rout
//=================
router.post('/', isAuthenticated, (req, res) => {
    //console.log(req.body)
    if(req.body.isReadyToSell === 'on'){ //if checked, req.body.isReadyToSell is set to 'on'
        req.body.isReadyToSell = true;
    } else { //if not checked, req.body.isReadyToSell is undefined
        req.body.isReadyToSell = false;
    }
    Product.create(req.body, (err, newProduct) => {
        res.redirect('/products')
    })
})

//=================
// PATCH rout
//=================
router.patch('/:id', (req, res) => {
    //console.log("i am checking the quantity")
    Product.findByIdAndUpdate(req.params.id, {$inc: {'qty': -1}}, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect(`/products/${req.params.id}`)
        }
    })
})


//=================
// SHOW rout
//=================
router.get('/:id', isAuthenticated, (req, res) => {
    //console.log(req.session.currentUser)
    Product.findById(req.params.id, (err, foundProduct) => {
        //console.log(foundProduct)
        res.render('products/show.ejs', {
            product: foundProduct,
            currentUser: req.session.currentUser
        })
    })
})



//=================
// EDIT rout
//=================
router.get('/:id/edit', isAuthenticated, (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('products/edit.ejs', {
            product: foundProduct,
            urrentUser: req.session.currentUser
        });
    })
})



//=================
// PUT/UPDATE rout
//=================
router.put('/:id', isAuthenticated, (req, res) => {
    if (req.body.isReadyToSell === 'on') {
        req.body.isReadyToSell = true;
    } else {
        req.body.isReadyToSell = false;
    }
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedProduct) => {
        res.redirect('/products');
    });
});


//=================
// DELETE rout
//=================
router.delete('/:id', isAuthenticated, (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        res.redirect('/products');
    })
});

//=================
// DROP DB rout
//=================
router.get(
    '/dropdatabase/cannotundo/areyoursure/reallysure/okthen',
    (req, res) => {
      Products.collection.drop()
      res.send('You did it! You dropped the database!')
    }
)



//=================
// EXPORTS
//=================
module.exports = router