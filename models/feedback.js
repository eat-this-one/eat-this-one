var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    userid : { type: String, required: true},
    content : { type: String, required: true},
    time : { type: Date, default: Date.now},
});

module.exports.schema = FeedbackSchema;
module.exports.model = mongoose.model('Feedback', FeedbackSchema);
