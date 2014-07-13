var encrypt = require('./encrypt.js');

var createToken = function(userid, expires) {

    if (typeof expires === 'undefined') {
        expires = 0;
    }

    var generatedToken = encrypt.AString();

    return {
        token : generatedToken,
        userid : userid,
        expires : expires
    };
};

module.exports.new = createToken;
