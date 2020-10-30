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
            console.log('added provided car data')
            res.redirect('/products/');
        })
    })
})


//=================
// INDEX rout
//=================
router.get('/', (req, res) => {
    Product.find((err, allProducts) => {
        console.log(allProducts)
        res.render('index.ejs', {
            //gives all product data a var name
            products: allProducts,
        })
    })
})

//=================
// NEW rout
//=================
router.get('/new', (req, res) => {
    res.render('new.ejs')
})


//=================
// POST/CREATE rout
//=================
router.post('/', (req, res) => {
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
    console.log("i am checking the price")
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
router.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        console.log(foundProduct)
        res.render('show.ejs', {
            product: foundProduct
        })
    })
})

//=================
// EDIT rout
//=================
router.get('/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('edit.ejs', {
            product: foundProduct,
        });
    })
})



//=================
// PUT/UPDATE rout
//=================
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        res.redirect('/products');
    })
});


module.exports = router