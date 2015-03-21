var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    gcmregid: { type: String, unique: true, sparse: true},
    apntoken: { type: String, unique: true, sparse: true},
    email: { type: String, required: true},
    name: { type: String, required: true},
    created: { type: Date, required: false, default: Date.now},
    modified: { type: Date, required: false, default: null}
});

// Export the model and the entity structure.
module.exports.schema = UserSchema;
module.exports.model = mongoose.model('User', UserSchema);
