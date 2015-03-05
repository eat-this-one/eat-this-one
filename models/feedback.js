var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content : { type: String, required: true},
    time : { type: Date, default: Date.now},
});

module.exports.schema = FeedbackSchema;
module.exports.model = mongoose.model('Feedback', FeedbackSchema);
