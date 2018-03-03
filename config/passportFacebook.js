var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./configAuth');

module.exports = function(passport){
    // Use the FacebookStrategy within Passport.
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret:configAuth.facebookAuth.clientSecret ,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields : configAuth.facebookAuth.profileFields
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(accessToken);
            console.log(refreshToken);
          //Check whether the User exists or not using profile.id
          //Further DB code.
          return done(null, profile);
        });
      }
    ));
};