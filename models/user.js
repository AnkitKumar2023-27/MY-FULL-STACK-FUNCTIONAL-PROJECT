
const { required } = require('joi');
const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

});
UserSchema.plugin(passportLocalMongoose);
User=mongoose.model("User",UserSchema);
module.exports=User;