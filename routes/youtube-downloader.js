var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('remote-app/youtube-app/youtube', { title: 'Fun View RC' });
});

module.exports = router;
