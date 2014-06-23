var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: user will be a reference to user schema
var MealSchema = new Schema({
    user: { type: String, required: true},
    dish: { type: String, required: true},
    created: { type: Date, default: Date.now},
});

// Export the model and the entity structure.
module.exports.schema = MealSchema;
module.exports.model = mongoose.model('Meal', MealSchema);
