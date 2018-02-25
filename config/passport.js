const LocalStrategy = require('passport-local').Strategy;
const login = require('../models/login');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        login.findOne({name:username},function(err,user){
            if(err)throw err;
            if(!user){
                return done(null,false,{message:'no user found'});
            }
            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in your password DB.
                bcrypt.compare(user.password, hash, function(err, isMatch){
                    if(err)throw err;
                    if(isMatch){
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'wrong password'});
                    }
                });
            });

        });
    }));

    passport.serializeUser(function(user, done) {
        var sessionUser = {id:user.id,name:user.username};
        done(null, sessionUser);
    });

    passport.deserializeUser(function(sessionUser, done) {
        login.findById(sessionUser.id, function(err, user) {
            done(err, user);
        });
    });
};