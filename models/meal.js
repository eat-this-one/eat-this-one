var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MealSchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Dish'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    created: { type: Date, default: Date.now}
});
MealSchema.index({dish : 1, user : 1}, {unique: true});

// Export the model and the entity structure.
module.exports.schema = MealSchema;
module.exports.model = mongoose.model('Meal', MealSchema);
