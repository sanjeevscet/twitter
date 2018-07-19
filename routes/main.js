const router = require('express').Router();
const User = require('../models/user');
const Tweet = require('../models/tweet');

router.get('/', (req, res, next) => {
	if(req.user) {

		Tweet.find({})
			.sort('-created')
			.populate('owner')
			.exec(function(err, tweets) {
				if(err) return next(err); 
				console.log(tweets);
				res.render('main/home', { tweets: tweets });
			});
	} 
	else {
		res.render('main/landing');
	}
});

router.get('/create-new-user', (req, res, next) => {
	var user = new User;
	user.email = "sanjeev25@gmail.com";
	user.name = "Sanjeev";
	user.password= "sanjeevscet";
	user.save(function(err) {
		if(err){
			return next(err);
		}
		res.json('Successfully created');
	})
	//res.render('main/landing');
});

module.exports = router;