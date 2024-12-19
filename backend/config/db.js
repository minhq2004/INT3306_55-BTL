// db.js
const { Sequelize } = require("sequelize");
require("dotenv").config(); // Để lấy các giá trị từ file .env

// Khởi tạo kết nối với MySQL
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "mysql",
  port: process.env.DB_PORT,
  logging: false, // Tắt log SQL nếu không cần thiết
});

module.exports = sequelize;
