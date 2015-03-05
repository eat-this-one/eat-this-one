var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    what : { type: String, required: true},
    where : { type: String, required: true},
    target : {type: String, required: false, default: null},
    time : { type: Date, default: Date.now},
});

module.exports.schema = LogSchema;
module.exports.model = mongoose.model('Log', LogSchema);
