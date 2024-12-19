// models/index.js
const sequelize = require("../config/db");
const DataTypes = require("sequelize");

// Import các model
const Airplane = require("./Airplane")(sequelize, DataTypes);
const Flight = require("./Flight")(sequelize, DataTypes);
const Seat = require("./Seat")(sequelize, DataTypes);
const Discount = require("./Discount")(sequelize, DataTypes);
const Booking = require("./Booking")(sequelize, DataTypes);
const File = require("./File")(sequelize, DataTypes);
const Post = require("./Post")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Admin = require("./Admin")(sequelize, DataTypes);
const Service = require("./Service")(sequelize, DataTypes);
const Airport = require("./Airport")(sequelize, DataTypes);
// Đặt tất cả các model vào một object
const models = {
  Airplane,
  Flight,
  Seat,
  Discount,
  Booking,
  File,
  Post,
  User,
  Admin,
  Service,
  Airport,
};

// Gọi phương thức associate để thiết lập quan hệ giữa các model
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Đồng bộ các mô hình với cơ sở dữ liệu
async function syncModels() {
  try {
    // Đồng bộ hóa tất cả các model với cơ sở dữ liệu
    await sequelize.sync();  // { force: true } sẽ xóa các bảng cũ và tạo lại bảng mới
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

syncModels(); 

module.exports = models; // Xuất các model để sử dụng trong các phần khác của ứng dụng
