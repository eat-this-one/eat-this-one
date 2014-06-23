var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: user will be a reference to user schema
var DishSchema = new Schema({
    user: { type: String, required: true},
    name: { type: String, required: true},
    description: { type: String, required: false, default: ''},
    where: { type: String, required: true},
    from: { type: Date, required: true},
    to: { type: Date, required: true},
    nportions: { type: Number, required: true},
    expecteddonation: { type: String, required: true},
    created: { type: Date, default: Date.now},
    modified: { type: Date, default: null, required: false}
});

// Export the model and the entity structure.
module.exports.schema = DishSchema;
module.exports.model = mongoose.model('Dish', DishSchema);
