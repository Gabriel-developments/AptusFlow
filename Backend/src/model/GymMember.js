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


GymMemberSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


GymMemberSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('GymMember', GymMemberSchema);