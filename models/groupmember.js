var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupMemberSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Group'
    },
    created: { type: Date, default: Date.now}
});
GroupMemberSchema.index( {user: 1, group: 1}, {unique : true} );

// Export the model and the entity structure.
module.exports.schema = GroupMemberSchema;
module.exports.model = mongoose.model('GroupMember', GroupMemberSchema);
