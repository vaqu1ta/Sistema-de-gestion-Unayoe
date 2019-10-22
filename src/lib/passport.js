const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use('local.signup', new LocalStrategy({
     usernameField: 'username',
     passwordField: 'password',
     passReqToCallback: true
}, async (req, username, password, done) => {
     //console.log(req.body);
     
     const newUser = {
          username,
          password
     }

}));

//Middleware
// passport.serializeUser((usr, done) => {

// })


