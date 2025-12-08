const mongoose = require('mongoose');

const SettingOptionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        index: true
    },
    value: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Ensure uniqueness of value per category
SettingOptionSchema.index({ category: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('SettingOption', SettingOptionSchema);
