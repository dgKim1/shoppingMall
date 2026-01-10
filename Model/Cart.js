const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const User = require("./User");
const cartSchema = Schema({
    userId: {type:String, required:true, unique:true},
    items: [{
        productId: {type: mongoose.objectId, ref:User},
        size: {type: String, required: true}
    }]
},{timestamps:true})

cartSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.updateAt;
    return obj;
}

const Cart = mongoose.model("Cart",cartSchema)
module.exports = Cart;