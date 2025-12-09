const mongoose = require('mongoose');

// Schema for fix costs (embedded document)
const FixCostSchema = new mongoose.Schema({
    type: String,
    calculationStartDate: Date,
    price: Number,
    startDate: Date,
    endDate: Date,
    documentName: String
});

const CarRegistrationSchema = new mongoose.Schema({
    // Basic Info
    status: { type: String, default: 'Available' },
    vehicleNumber: String,
    branch: String,
    truckType: String,
    brand: String,
    company: String,
    engineNumber: String,
    chassisNumber: String,
    color: String,
    fuelType: String,
    model: String,
    carryWeight: Number,
    insurance: String,

    // Dates
    registrationDate: Date,
    renewalDate: Date,
    expirationDate: Date,

    // Performance Metrics
    avgMilePerFuel: Number,
    maintenanceCostPerKm: Number,
    tireCostPerKm: Number,
    mileage: Number,
    lastMileage: Number,

    // Container Dimensions
    containerWidth: Number,
    containerLength: Number,
    containerHeight: Number,
    carWeight: Number,
    cbm: Number,

    // Fix Costs
    fixCosts: [FixCostSchema],

    // Files (store file names/paths)
    files: [String]
}, { timestamps: true });

module.exports = mongoose.model('CarRegistration', CarRegistrationSchema);