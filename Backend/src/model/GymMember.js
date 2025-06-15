const mongoose = require('mongoose');

const GymMemberSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        objective: {type: String, require: true},
        hasLimitingConditions: {type: Boolean, require: true},
        limitingConditions: {type: String, require: false},
    }
);

module.exports = mongoose.model('GymMember', GymMemberSchema);