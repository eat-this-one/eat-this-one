var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    name: { type: String, required: true, unique: true},
    code:  { type: String, required: true, unique: true},
    country: { type: String, required: true},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = GroupSchema;
module.exports.model = mongoose.model('Group', GroupSchema);
