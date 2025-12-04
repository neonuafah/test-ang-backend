const express = require('express');
const router = express.Router();
const CarRegistration = require('../models/CarRegistration');

router.post('/', async (req, res) => {
    try {
        const newCarRegistration = new CarRegistration(req.body);
        await newCarRegistration.save();
        res.status(201).json({ message: "Success", data: newCarRegistration });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const carRegistrations = await CarRegistration.find();
        res.json(carRegistrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;