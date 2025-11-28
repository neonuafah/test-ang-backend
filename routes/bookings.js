const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        
        // 🔥 เรียกใช้ Socket.io ตรงนี้ได้แล้ว!
        // ใช้ req.io แทน io เฉยๆ
        req.io.emit('server_notify_new_booking', newBooking);
        
        res.status(201).json({ message: "Success", data: newBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ⚠️ อย่าลืมบรรทัดนี้สำคัญมาก! ไม่งั้น app.js จะ error
module.exports = router;