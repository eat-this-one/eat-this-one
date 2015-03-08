var encrypt = require('./encrypt.js');

var createToken = function(userid, expires) {

    if (typeof expires === 'undefined') {
        expires = 0;
    }

    var generatedToken = encrypt.AString();

    return {
        token : generatedToken,
        user : userid,
        expires : expires
    };
};

module.exports.new = createToken;
