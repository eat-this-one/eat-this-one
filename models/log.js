var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    userid : { type: String, required: true},
    what : { type: String, required: true},
    where : { type: String, required: true},
    target : {type: String, required: false, default: null},
    time : { type: Date, default: Date.now},
});

module.exports.schema = LogSchema;
module.exports.model = mongoose.model('Log', LogSchema);
