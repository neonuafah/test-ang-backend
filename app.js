require('dotenv').config();
const http = require("http");
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require("path");
const bookingRoute = require('./routes/bookings');
const Booking = require('./models/Booking');
const app = express();
app.use(cors());

app.use(express.json());
// สร้าง HTTP Server จาก Express
const server = http.createServer(app);

// ตั้งค่า Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // อนุญาตให้เชื่อมต่อจากที่ไหนก็ได้ (Production ควรระบุ Domain)
    methods: ["GET", "POST"]
  }
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createBooking', async (data) => {
    console.log('Received createBooking event:', data);
    try {
      const bookingData = {
        type: data.bookingType,
        job: data.job,
        status: data.status || 'new',
        booking_No: data.bookingNo,
        branch: data.branch,
        customer_number: data.customerNo,
        customer_name: data.customerName,
        origin: data.origin,
        destination: data.destination,
        carrier: data.carrier,
        ship_name: data.shipName,
        coload: data.coloadName,
        port_of_loading: data.portOfLoading,
        transport_number: data.voyFlightNo,
        eta_date: data.etdDate,
        eta_time: data.etdTime,
        quantity: data.qtyContainers,
        container_type: data.containerType,
        customer_invoice: data.customerInvoice,
        hawb_number: data.hawbNo,
        mawb_number: data.mawbNo,
        cargo_quantity: data.cargoQty,
        total_weight: data.totalWeight,
        width: data.dimensionWidth,
        height: data.dimensionHeight,
        length: data.dimensionLength,
        cbm: data.cbm,
        truck_type: data.truckType,
        cargo_type: data.cargoType,
        container_return_location: data.containerReturnLoc,
        distance: data.distance,
        contact: data.contact,
        phone_number: data.phone,
        remark: data.remarks,
        billing_address: data.billingAddress,
        transport_charge: data.transportCharge,
        attachment: data.attachments
      };

      const newBooking = new Booking(bookingData);
      await newBooking.save();
      console.log('Booking saved via socket:', newBooking._id);

      // Notify clients
      io.emit('server_notify_new_booking', newBooking);

    } catch (err) {
      console.error('Error saving booking via socket:', err);
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 🔥 [สำคัญ] เพิ่ม Middleware นี้ลงไป ก่อนเรียก routes
// หน้าที่: ฝากตัวแปร io ใส่กระเป๋า req ไปด้วย
app.use((req, res, next) => {
  req.io = io;
  next();
});

// เรียกใช้ Route
app.use('/api/bookings', bookingRoute);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  // ส่งไฟล์ index.html ไปแสดงผล
  res.sendFile(path.join(__dirname, 'index.html'));
});