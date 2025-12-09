const mongoose = require('mongoose');

// Schema for fix costs (embedded document) - เก็บ fix costs ไว้ใน document ของ partner vehicle
const FixCostSchema = new mongoose.Schema({
    type: String,
    calculationStartDate: Date,
    price: Number,
    startDate: Date,
    endDate: Date,
    documentName: String
});

const PartnerVehicleSchema = new mongoose.Schema({
    // Basic Info
    branch: String,
    truckType: String,
    contact: String,
    phone: String,
    remark: String,
    status: { type: String, default: 'Active' }, // Active or Inactive

    // Fix Costs - embedded array ทำให้รู้ว่า fix cost ใดเป็นของ partner vehicle ใด
    fixCosts: [FixCostSchema]
}, { timestamps: true });

module.exports = mongoose.model('PartnerVehicle', PartnerVehicleSchema);
