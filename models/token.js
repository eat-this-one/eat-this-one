var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    userid: { type: String, required: true},
    token: { type: String, required: true},
    expires: { type: Number, required: false}
});

// Export the model and the entity structure.
module.exports.schema = TokenSchema;
module.exports.model = mongoose.model('Token', TokenSchema);
