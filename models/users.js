const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  shoppingCart: [{type: Schema.Types.ObjectId, ref: 'Products'}] 
});


const User = mongoose.model('User', userSchema);



let showAll = (err, user)=>{
	User.find().populate('products').exec((err, products)=>{ //dynamically switch out any ids with the objects they reference
		//console.log(products);
		mongoose.connection.close();
	});
};


module.exports= User;