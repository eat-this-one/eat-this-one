var FeedbackModel = require('../models/feedback.js').model;

function EatFeedback(eat) {
    this.eat = eat;
    this.attrs = {
        id : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        user : {
            validation : ['isNotEmpty', 'isMongoId']
        },
        content : {
            validation : ['isNotEmpty', 'matches'],
            pattern : eat.getStringRegEx()
        }
    };
}

EatFeedback.prototype.add = function() {

    var feedback = new FeedbackModel({
        user : this.eat.getUserid(),
        content : this.eat.getParam(
            'content',
            this.attrs.content.validation,
            this.attrs.content.pattern
        )
    });

    feedback.save(function(error) {
        if (error) {
            this.eat.returnCallback(error);
        }
        this.eat.returnCallback(null, feedback, 201);
    }.bind(this));
};

module.exports = EatFeedback;
