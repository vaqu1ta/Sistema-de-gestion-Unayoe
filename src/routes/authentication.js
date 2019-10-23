const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) => {
     res.render('auth/signup');
})

router.post('/signup', passport.authenticate('local.signup', {
     successRedirect: '/',
     failureRedirect: '/signup',
     failureFlash: true
}))

router.get('/signin', (req, res) => {
     res.render('auth/signin');
})

router.get('/profile', (req, res) => {
     res.send('this is your profile')
})

router.post('/signin', (req, res, next) => {
     passport.authenticate('local.signin', {
          successRedirect: '/',
          failureRedirect: '/signin',
          failureFlash: true
     })(req, res, next);
})


module.exports = router;