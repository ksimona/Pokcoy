var express = require('express');
var router = express.Router();
var checkAuth = require('../controller/checkAuthentication');

router.get('/',checkAuth.checkAuth,function(req,res,next){
    res.render('cart');
});

module.exports = router;