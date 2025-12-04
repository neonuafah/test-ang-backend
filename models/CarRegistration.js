const mongoose = require('mongoose');

const CarRegistrationSchema = new mongoose.Schema({
    status: String,
    vehicle_number: String,
    fuel_type: String,
    type: String,
    brand: String,
    company: String,
    registration_date: date,
    renewal_date: date,
    expiration_date: date,
    weight: Number,
    cbm: Number
});

module.exports = mongoose.model('carRegistration', CarRegistrationSchema);