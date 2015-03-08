var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSubscriptionSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    loc: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'
    },
    created: { type: Date, default: Date.now}
});
LocationSubscriptionSchema.index( {user: 1, loc: 1}, {unique : true} );

// Export the model and the entity structure.
module.exports.schema = LocationSubscriptionSchema;
module.exports.model = mongoose.model('LocationSubscription', LocationSubscriptionSchema);
