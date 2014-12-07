var express = require('express');
var nconf = require('nconf');

var router = express.Router();

router.get('/eat-this-one.apk', function(req, res) {
    res.redirect(nconf.get('ANDROID_DOWNLOAD_URL'));
});

module.exports = router;
