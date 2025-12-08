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

  socket.on('createBooking', async (data) => {
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

      // Notify clients
      io.emit('server_notify_new_booking', newBooking);

    } catch (err) {
      console.error('Error saving booking via socket:', err);
    }
  });

  socket.on('createCarRegistration', async (data) => {
    try {
      const carRegistrationData = {
        status: data.status,
        vehicle_number: data.vehicleNumber,
        fuel_type: data.fuelType,
        type: data.type,
        brand: data.brand,
        company: data.company,
        registration_date: data.registrationDate,
        renewal_date: data.renewalDate,
        expiration_date: data.expirationDate,
        weight: data.weight,
        cbm: data.cbm
      };
      const newCarRegistration = new CarRegistration(carRegistrationData);
      await newCarRegistration.save();

      // Notify clients
      io.emit('server_notify_new_car_registration', newCarRegistration);

    } catch (err) {
      console.error('Error saving car registration via socket:', err);
    }
  });
  // Handle request to fetch all bookings
  socket.on('getBookings', async () => {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      socket.emit('bookingsList', bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      socket.emit('bookingsList', []);
    }
  });


  socket.on('disconnect', () => {
    // User disconnected
  });

  // --- Setting Options (Dropdowns) ---
  const SettingOption = require('./models/SettingOption');

  socket.on('getSettings', async (category) => {
    try {
      // If category is provided, filter by it. If null/undefined, get all? 
      // Usually the client asks for specific category.
      // Let's support fetching by category.
      const query = category ? { category } : {};
      const options = await SettingOption.find(query).sort({ value: 1 });
      socket.emit('settingsList', { category, options });
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  });

  socket.on('createSetting', async (data) => {
    try {
      const { category, value } = data;
      if (!category || !value) {
        return;
      }

      // Check for duplicates
      const existing = await SettingOption.findOne({ category, value });
      if (existing) {
        return;
      }

      const newOption = new SettingOption({ category, value });
      await newOption.save();

      // Emit back to ALL clients to update their dropdowns
      io.emit('newSettingAdded', newOption);
    } catch (err) {
      console.error('Error saving setting:', err);
    }
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