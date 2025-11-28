require('dotenv').config();
const http = require("http");
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require("path");

// Import Model
const Booking = require('./models/Booking');

const app = express();
app.use(cors());

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

    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});






const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  // ส่งไฟล์ index.html ไปแสดงผล
  res.sendFile(path.join(__dirname, 'index.html'));
});