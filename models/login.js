var mongoose = require('mongoose');

var LoginSchema = mongoose.Schema(
    {
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    },

    {
        collection:"Login"
    });

module.exports = mongoose.model('Login',LoginSchema);