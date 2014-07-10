var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSubscriptionSchema = new Schema({
    userid: { type: String, required: true},
    locationid: { type: String, required: true},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = LocationSubscriptionSchema;
module.exports.model = mongoose.model('LocationSubscription', LocationSubscriptionSchema);
