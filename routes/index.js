var express = require('express');
var fs = require('fs');
var router = express.Router();
var localIPAdress = require('address').ip();
var port = '3000';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fun View', localAddress: localIPAdress, port: port});
});

module.exports = router;
