var express = require('express');
var path = require('path');
var fs = require('fs');

var router = express.Router();

router.get('/eat-this-one.apk', function(req, res) {
    var filePath = path.join(__dirname, '/../download/' + 'eat-this-one.apk');
    if (fs.existsSync(filePath)) {
        res.statusCode = 200;
        res.download(filePath);
        return;
    } else {
        res.statusCode = 500;
        res.send('Error: File does not exist');
        return;
    }
});

module.exports = router;
