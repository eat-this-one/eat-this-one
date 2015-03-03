var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: { type: String, required: true, unique: true},
    expires: { type: Number, required: false}
});

// Export the model and the entity structure.
module.exports.schema = TokenSchema;
module.exports.model = mongoose.model('Token', TokenSchema);
