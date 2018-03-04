var express = require('express');
var router = express.Router();
var url = require('url');
var passport = require('passport');
var checkAuth = require('../controller/checkAuthentication');
var logout = require('../controller/logout');
var fs = require('fs');
var ejs = require('ejs');
var config = require('../config/config');

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

router.get('/auth/facebook',function(req,res,next){
    passport.authenticate('facebook',{scope : ['public_profile', 'email']})(req,res,next);
});

router.get('/auth/facebook/callback',function(req,res,next){
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect: '/'
    })(req,res,next)
});

router.post('/register',function(req,res,next){
    req.checkBody('usernameReg','enter a valid email').isEmail();
    req.checkBody('passwordReg',"password can't be empty").notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var mail = errors.find(x=>x.param=='usernameReg');
        var pass = errors.find(x=>x.param=='passwordReg');
        var jsn = {};
        if(mail){
            jsn.errEmail = mail.msg;
        }
        jsn.errPass = pass?pass.msg:undefined;
        res.render('home',jsn);
    }
    else{
        res.sendStatus(200);
    }
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

router.post('/sendMail',function(req,res,next){
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.SendGridAPI);
    var file = fs.readFileSync(__dirname+'/../views/emailPage.ejs','utf8');
    var html = ejs.compile(file)({text:'and easy to do anywhere, even with Node.js'});
    const msg = {
        to: req.body.txtMail,
        from: 'test@ivh.me',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: html
    };
    sgMail.send(msg,function(err,mssg){
        if(err){
            res.render('home',{message:'error sending email, try again!'});
        }
        else{
            console.log(mssg);
            req.flash('success','Email sent');
            res.redirect('/');
        }
    });
});

router.post('/logout',checkAuth.checkAuth,logout);

module.exports = router;