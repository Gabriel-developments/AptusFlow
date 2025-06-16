const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PersonalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    CREF: { type: String, required: true },
    UF: {type: String, require: true},
    town: {type: String, require: true},
    calendarId: { type: String },
    availability: {
        workDays: { type: [Number], default: [1, 2, 3, 4, 5] },
        startHour: { type: Number, default: 8 }, 
        endHour: { type: Number, default: 20 },
        appointmentDuration: { type: Number, default: 60 } 
    }
});

PersonalSchema.pre('save', async function(next) {
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

PersonalSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('Personal', PersonalSchema);