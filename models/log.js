var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    userid : { type: String, required: true},
    what : { type: String, required: true},
    where : { type: String, required: true},
    time : { type: Date, default: Date.now},
});

module.exports.schema = LogSchema;
module.exports.model = mongoose.model('Log', LogSchema);
