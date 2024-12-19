// Working
const bcrypt = require("bcrypt");
const { Admin } = require("../models"); // Yêu cầu tất cả các mô hình từ models/index.js

// Hàm lấy tất cả tài khoản admin
const getAllAdmins = async (req, res) => {
  try {
    // Lấy số trang từ params, mặc định là 1 nếu không có
    const page = parseInt(req.params.page) || 1;

    // Số admin mỗi trang mặc định là 10
    const pageSize = 10;

    // Tính toán offset (dữ liệu bỏ qua)
    const offset = (page - 1) * pageSize;

    // Truy vấn tất cả admin từ bảng admins với phân trang và sắp xếp theo createdAt giảm dần
    const { rows: admins, count } = await Admin.findAndCountAll({
      attributes: [
        "admin_id",
        "name",
        "email",
        "phone",
        "createdAt",
        "updatedAt",
      ],
      limit: pageSize,
      offset: offset,
      order: [["admin_id", "ASC"]], // Sắp xếp theo createdAt giảm dần
    });

    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }

    res.status(200).json({
      message: "Admins retrieved successfully",
      totalAdmins: count, // Tổng số admins trong cơ sở dữ liệu
      totalPages: Math.ceil(count / pageSize), // Số trang tổng cộng
      currentPage: page, // Trang hiện tại
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật thông tin admin
const updateAdmin = async (req, res) => {
  const { admin_id } = req.user; // Lấy admin_id từ decoded JWT (đã xác thực)
  const { name, phone, password } = req.body;

  try {
    // Tìm admin trong cơ sở dữ liệu
    const admin = await Admin.findOne({ where: { admin_id } });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Nếu có mật khẩu mới, mã hóa mật khẩu mới
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Cập nhật thông tin admin
    const updatedAdmin = await admin.update({
      name: name || admin.name, // Nếu không có name mới, giữ nguyên tên cũ
      phone: phone || admin.phone, // Nếu không có phone mới, giữ nguyên phone cũ
      password_hash: hashedPassword || admin.password_hash, // Nếu không có mật khẩu mới, giữ nguyên mật khẩu cũ
    });

    res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllAdmins, updateAdmin };
