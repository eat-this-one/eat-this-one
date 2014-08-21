var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    data: { type: String, required: true},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = PhotoSchema;
module.exports.model = mongoose.model('Photo', PhotoSchema);
