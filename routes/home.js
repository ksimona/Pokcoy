var express = require('express');
var router = express.Router();
var url = require('url');
var passport = require('passport');
var checkAuth = require('../controller/checkAuthentication');
var logout = require('../controller/logout');

/* GET home page. */
router.get('/', function(req, res, next) {
    var session = req.session;
    if(session.countonline || session.countonline==0){
        session.countonline=session.countonline+1;
    }
    else{
        session.countonline = 1;
    }
    res.render('home', { countonline:session.countonline });
    // next();
});

router.post('/login', function(req,res,next){
    passport.authenticate('local', function(err,user,info){
        if (err) { return next(err); }
        if (!user) { return res.render('home', { countonline:req.session.countonline, message:info.message }) }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.render('home', { countonline:req.session.countonline, loggedin:true });
        });
    })(req,res,next);
});

router.post('/logout',checkAuth.checkAuth,logout);

module.exports = router;
