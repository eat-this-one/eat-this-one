var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('This is the API index, check the services list below TODO')
});

module.exports = router;
