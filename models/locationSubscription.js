var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSubscriptionSchema = new Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    locationid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Location'
    },
    created: { type: Date, default: Date.now}
});
LocationSubscriptionSchema.index( {userid: 1, locationid: 1}, {unique : true} );

// Export the model and the entity structure.
module.exports.schema = LocationSubscriptionSchema;
module.exports.model = mongoose.model('LocationSubscription', LocationSubscriptionSchema);
