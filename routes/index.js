var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('API index')
});

module.exports = router;
