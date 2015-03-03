var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MealSchema = new Schema({
    dishid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'Dish'
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    created: { type: Date, default: Date.now}
});
MealSchema.index({dishid : 1, userid : 1}, {unique: true});

// Export the model and the entity structure.
module.exports.schema = MealSchema;
module.exports.model = mongoose.model('Meal', MealSchema);
