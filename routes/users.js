var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//Handles the passport authentication methods
require('../config/passport.js')(passport, LocalStrategy, FacebookStrategy);

//Requiring user-schema for registering etc.
var User = require('../models/user');

// Register - GET 
router.get('/register', function(req, res){
	res.render('register');
});

// Register - POST
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// Login - GET
router.get('/login', function(req, res){
	res.render('login');
});

// Login - POST
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
});

// Logout - GET
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

// Login Facebook - GET
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

 // handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
     passport.authenticate('facebook', {
         successRedirect : '/',
         failureRedirect : '/'
}));

module.exports = router;