const bcrypt = require("bcrypt");
const { User } = require("../models");

// Lay thong tin cua user dang nhap
const getUserInfo = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ middleware xác thực
    const user = req.user;

    res.json({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      email: user.email,
      phone: user.phone,
      id_card: user.id_card,
      passport: user.passport,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật thông tin cá nhân của người dùng
const updateUser = async (req, res) => {
  const { user_id } = req.user; // Lấy user_id từ decoded JWT (đã xác thực)
  const {
    first_name,
    last_name,
    phone,
    date_of_birth,
    gender,
    passport,
    password,
  } = req.body;

  // Kiểm tra các trường yêu cầu
  if (!first_name || !last_name || !date_of_birth) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tìm user trong cơ sở dữ liệu
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Nếu có mật khẩu mới, mã hóa mật khẩu mới
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await user.update({
      first_name: first_name || user.first_name, // Nếu không có first_name mới, giữ nguyên first_name cũ
      last_name: last_name || user.last_name, // Nếu không có last_name mới, giữ nguyên last_name cũ
      phone: phone || user.phone, // Nếu không có phone mới, giữ nguyên phone cũ
      date_of_birth: date_of_birth || user.date_of_birth, // Nếu không có date_of_birth mới, giữ nguyên date_of_birth cũ
      gender: gender || user.gender, // Nếu không có gender mới, giữ nguyên gender cũ
      passport: passport || user.passport, // Nếu không có passport mới, giữ nguyên passport cũ
      password_hash: hashedPassword || user.password_hash, // Nếu không có mật khẩu mới, giữ nguyên mật khẩu cũ
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy thông tin tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    // Lấy số trang từ params, mặc định là 1 nếu không có
    const page = parseInt(req.params.page) || 1;

    // Số user mỗi trang mặc định là 10
    const pageSize = 10;

    // Tính toán offset (dữ liệu bỏ qua)
    const offset = (page - 1) * pageSize;

    // Truy vấn tất cả user từ bảng users với phân trang và sắp xếp theo createdAt giảm dần
    const { rows: users, count } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "passport",
        "id_card",
        "createdAt",
        "updatedAt",
      ],
      limit: pageSize,
      offset: offset,
      order: [["user_id", "ASC"]], // Sắp xếp theo createdAt giảm dần
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      totalUsers: count, // Tổng số users trong cơ sở dữ liệu
      totalPages: Math.ceil(count / pageSize), // Số trang tổng cộng
      currentPage: page, // Trang hiện tại
      users,
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateUser, getAllUsers, getUserInfo };
