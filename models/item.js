var mongoose = require('mongoose');

var LoginSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        imagePath:{
            type:String,
            required:true
        },
        userId:{
            type:String,
            required:true
        }
    },
    {
        collection:"Item"
    });

module.exports = mongoose.model('Item',LoginSchema);