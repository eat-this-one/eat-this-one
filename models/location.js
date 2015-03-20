var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    name: { type: String, required: true, unique: true},
    code:  { type: String, required: true, unique: true},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = LocationSchema;
module.exports.model = mongoose.model('Location', LocationSchema);
