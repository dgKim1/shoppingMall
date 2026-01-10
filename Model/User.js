const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const userSchema = Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    name: {type:true, required:true},
    level:{type:String,default:"customer"} //2types: customer, user
},{timestamps:true})

userSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.password
    delete obj.__V
    delete obj.updateAt
    delete obj.createAt
    return obj
}

const User = mongoose.model("User",userSchema)
module.exports = User;