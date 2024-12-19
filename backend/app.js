const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const sequelize = require("./config/db");
const path = require("path");
const morgan = require('morgan');

// Middleware
app.use(cors());
app.use(morgan('tiny'));

// Middleware cho JSON
app.use(express.json());

// Cấu hình để Express phục vụ các tệp tin tĩnh từ thư mục public
app.use("/public", express.static(path.join(__dirname, "public")));

// Login And Register
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes); // auth

// Public
const publicRoutes = require("./routes/publicRoutes"); // public

app.use("/api/public", publicRoutes); // public

// User
const userRoutes = require("./routes/userRoutes");

app.use("/api/user", userRoutes);

// Admin
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send(`Welcome to QAirline API!`);
});

// Kiểm tra kết nối với database và tạo bảng nếu chưa có
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
