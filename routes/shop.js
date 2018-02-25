var express = require('express');
var router = express.Router();
var checkAuth = require('../controller/checkAuthentication');
var addItem = require('../controller/addItem');
var fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/',checkAuth.checkAuth, function(req, res, next) {
    fs.readdir('./public/images/',function(err,files){
        var arr = [];
        var count = 0;
        if(err) throw err;
        files.forEach(function(file){
            arr[count] = '/images/'+file;
            count++;
        });
        res.render('shop',{item:arr});
    });
});

router.post('/',function(req,res){
    console.log(req.user);
    console.log(req.body.string);
    res.send(200);
});

router.post('/add',checkAuth.checkAuth,addItem.addItem);

module.exports = router;
