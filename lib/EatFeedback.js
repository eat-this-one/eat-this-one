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
        user : this.eat.getUserid()
    });

    feedback = this.eat.fillWithReqParams(feedback, this.attrs, ['content']);
    if (feedback === false) {
        return this.eat.returnCallback({
            code: 400,
            message: 'Bad request'
        });
    }

    feedback.save(function(error) {
        if (error) {
            this.eat.returnCallback(error);
        }
        this.eat.returnCallback(null, feedback, 201);
    }.bind(this));
};

module.exports = EatFeedback;
