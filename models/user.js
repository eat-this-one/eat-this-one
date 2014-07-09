var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO Add users to the app logic.
var UserSchema = new Schema({
    email: { type: String, required: true},
    password: { type: String, required: false},
    name: { type: String, required: false},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = UserSchema;
module.exports.model = mongoose.model('User', UserSchema);
