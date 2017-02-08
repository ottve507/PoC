var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Post = require('../models/post');

var get_post = mongoose.model('Post');

// Post page
router.get('/post', function(req, res){
	//var cursor = req.db.collection('posts').find()
	//console.log(cursor)
	//res.render('posts/post', {})
	
	//get_post.find({}).sort('-_id').execFind(function(err, posts){
	//  		if(posts){
	//  			res.render('posts/post', {posts:posts});
	//  		}else{
	//  			res.render('posts/post', {})
	//  		}
	//});
	
	//req.db.collection('quotes').find().toArray((err, result) => {
	 //   if (err) return console.log(err)
	//	res.render('posts/post', {quotes: result});
	//  })
	req.db.collection('posts').find().toArray((err, result) => {
	    if (err) return console.log(err)
		res.render('posts/post', {posts: result, username: req.user});
	  })
	
	
});

// Register post
router.post('/post', function(req, res){
	var name = req.body.name;
	var text = req.body.text;
	
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('text', 'Text is required').notEmpty();
	
	var errors = req.validationErrors();

	if(errors){
		req.flash('error_msg', 'Failed to post');
		res.redirect('post');
	} else {
		var newPost = new Post({
			name: name,
			text:text
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