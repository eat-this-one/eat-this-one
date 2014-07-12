var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO Add users to the app logic.
var UserSchema = new Schema({
    email: { type: String, required: true},
    password: { type: String, required: true},
    name: { type: String, required: true},
    created: { type: Date, default: Date.now},
    modified: { type: Date, default: null, required: false}
});

// Export the model and the entity structure.
module.exports.schema = UserSchema;
module.exports.model = mongoose.model('User', UserSchema);
