var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Post = require('../models/post');
//var User = require('../models/user');
var User = mongoose.model('User');
var get_post = mongoose.model('Post');

// Post page
router.get('/post', function(req, res){
	Post.find().populate('user').exec(function(err, result) {
	    if (err) return console.log(err)
		res.render('posts/post', {posts: result});
	 })
});

//Show individual post
router.get('/post/:id', (req, res) => {
  // find the post in the `posts` array

  //var post = req.db.collection('posts').find({_id : req.params.id})
  //var post = Post.findById({_id : req.params.id})
  //var post = req.post
  var post = Post.findById(req.params.id, function(err, post) {
    if (err) return next(err);
    res.render('posts/show', {
		post: post,
	    title: post.name,
	    body: post.text
	  })
  });  
})

// Register post
router.post('/post', function(req, res){
	var name = req.body.name;
	var text = req.body.text;
	var user = req.user;
	
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('text', 'Text is required').notEmpty();
	
	var errors = req.validationErrors();

	if(errors){
		req.flash('error_msg', 'Failed to post');
		res.redirect('post');
	} else {
		var newPost = new Post({
			name: name,
			text:text,
			user:user
		});

		Post.createPost(newPost, function(err, post){
			if(err) throw err;
			console.log(post);
		});

		req.flash('success_msg', 'Posted');
		res.redirect('post');
	}
});

module.exports = router;