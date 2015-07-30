var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('remote-app/settings-app/settings', { title: 'FunView settings' });
});

module.exports = router;
