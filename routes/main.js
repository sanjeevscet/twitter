const router = require('express').Router();


router.get('/', (req, res, next) => {
	res.render('main/landing');
	//res.json('donkey');
});

module.exports = router;