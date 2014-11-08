var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DishSchema = new Schema({
    userid: { type: String, required: true},
    locationid: { type: String, required: true},
    photoid: { type: String, required: false, default: ''},
    name: { type: String, required: true},
    description: { type: String, required: false, default: ''},
    when: { type: Date, required: true},
    nportions: { type: Number, required: true, default: 0},
    donation: { type: String, required: true},
    created: { type: Date, default: Date.now},
    modified: { type: Date, default: null, required: false}
});

// Export the model and the entity structure.
module.exports.schema = DishSchema;
module.exports.model = mongoose.model('Dish', DishSchema);
