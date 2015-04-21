var PhotoModel = require('../models/photo.js').model;

function EatPhoto(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        }
    };
}

EatPhoto.prototype.get = function() {

    // Let's be honest, I don't want to check the access here
    // unless people complains about privacy.

    // TODO As a security measure for bulk downloads we could
    // ban users with more photo.get requests than dishes in
    // its group.
    var id = this.eat.getParam('id', this.attrs.id.validation);
    if (id === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    PhotoModel.findById(id, function(error, photo) {
        if (error) {
            return this.eat.returnCallback(error);
        }
        return this.eat.returnCallback(null, photo);
    }.bind(this));
};

module.exports = EatPhoto;
