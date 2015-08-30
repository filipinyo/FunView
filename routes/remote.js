var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('remote-app/remote', { title: 'Fun View RC' });
});

router.get('/settings', function(req, res, next) {
	res.render('remote-app/settings-app/settings', { title: 'FunView settings' });
});

router.get('/youtube', function(req, res, next) {
	res.render('remote-app/youtube-app/youtube', { title: 'Youtube Downloader' });
});

module.exports = router;
