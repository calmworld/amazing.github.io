//==================================
// Dependencies
//==================================
const mongoose = require('mongoose'); // require mongoose
const Schema = mongoose.Schema // create a shorthand for the mongoose Schema constructor


//=====================================
// Create a new Schema
//=====================================
// This will define the shape of the documents in the collection
// https://mongoosejs.com/docs/guide.html

const productSchema = new Schema({
    name:  { type: String, required: true },
    description:  { type: String, required: true },
    img: {type: String, required: true},
    price: Number,
    qty: Number,
    isReadyToSell: { type: Boolean, default: false }
})


//================================================
// Creating Product model: We need to convert our schema into a model -- will be stored in 'products' collection. Mongo does this for you automatically.
//================================================
// Models are fancy constructors compiled from Schema definitions
// An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB Database
// From here: https://mongoosejs.com/docs/models.html
const productSeed = mongoose.model('productSeed', productSchema);

module.exports = productSeed; //use module.exports to export this mongoose.model