var validator = require('validator');

var TokenModel = require('../models/token.js').model;

module.exports = {

    res : null,
    req : null,

    setReqRes : function(req, res) {
        this.req = req;
        this.res = res;
    },

    setRes : function(res) {
        this.res = res;
    },

    setReq : function(req) {
        this.req = req;
    },

    getRes : function() {
        return this.res;
    },

    getReq : function() {
        return this.req;
    },

    /**
     * Generic callback used to return data.
     */
    returnCallback : function(error, returnData, statusCode) {
        if (error) {
            this.res.statusCode = error.code;
            this.res.send(error.msg);
            return;
        }
        this.res.statusCode = statusCode;
        this.res.send(returnData);
        return;
    },

    /**
     * Checks that the request token is valid.
     */
    checkValidToken : function(callback) {

        var token = this.req.param('token');

        if (typeof token == 'undefined') {
            var error = {
                code : 400,
                msg : 'Wrong credentials'
            };
            return callback(error);
        }
        TokenModel.find({token: token}, function(error, token) {
            if (error) {
                return callback(error);
            }
            // We just execute the callback.
            return callback(null);
        });
    },

    /**
     * Checks and returns the specified request param
     *
     * It returns a 400 if the param contains
     * unexpected characters.
     */
    getParam : function(key, validation) {

        // Getting the request value.
        var value = this.req.param(key);

        // Unexpected contents.
        if (!validator[validation](value)) {
            var error = {
                code : 400,
                msg : 'Wrong ' + key + ' param contents'
            };
            this.returnCallback(error);
        }
        return value;
    }
};
