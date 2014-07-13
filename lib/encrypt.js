var nconf = require('nconf');
var crypto = require('crypto');

var encryptString = function(targetString) {

    // If no argument is passed we generate a random string.
    if (typeof targetString === 'undefined') {
        console.log('encryptString: Generating random string as no target was provided.');
        targetString = Math.floor(Math.random() * 999999).toString()
    }

    var sum = crypto.createHash('sha1');
    sum.update(targetString);
    return sum.digest('hex');
};

var encryptPassword = function(password) {
    return encryptString(password + nconf.get('PWD_SALT'));
};

// Exporting encrypt.AString.
// Exporting encrypt.APassword.
module.exports.AString = encryptString;
module.exports.APassword = encryptPassword;
