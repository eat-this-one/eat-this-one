var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MealSchema = new Schema({
    dishid: { type: String, required: true},
    userid: { type: String, required: true},
    created: { type: Date, default: Date.now}
});

// Export the model and the entity structure.
module.exports.schema = MealSchema;
module.exports.model = mongoose.model('Meal', MealSchema);
