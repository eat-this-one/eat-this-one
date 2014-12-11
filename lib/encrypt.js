var nconf = require('nconf');
var crypto = require('crypto');

var encryptString = function(targetString) {

    // If no argument is passed we generate a random string.
    if (typeof targetString === 'undefined') {
        targetString = Math.floor(Math.random() * 999999).toString()
    }

    var sum = crypto.createHash('sha1');
    sum.update(targetString);
    return sum.digest('hex');
};

var encryptPassword = function(password) {
    var salt = process.env.SALT || nconf.get('SALT');
    return encryptString(password + salt);
};

// Exporting encrypt.AString.
// Exporting encrypt.APassword.
module.exports.AString = encryptString;
module.exports.APassword = encryptPassword;
