const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
  (req, res) => {
    res.redirect('/');
  });


module.exports = router;
