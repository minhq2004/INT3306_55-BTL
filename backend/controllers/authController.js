const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Admin, User } = require("../models");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Missing required fields: email, password" });
  }

  try {
    // Kiểm tra email trong bảng users
    let user = await User.findOne({ where: { email } });

    // Nếu không tìm thấy user, kiểm tra trong bảng admins
    if (!user) {
      user = await Admin.findOne({ where: { email } });

      // Nếu không tìm thấy trong cả 2 bảng
      if (!user) {
        return res.status(404).json({ message: "User/Admin not found" });
      }

      // Kiểm tra mật khẩu của admin
      const isPasswordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Tạo JWT token cho admin
      const token = jwt.sign(
        { admin_id: user.admin_id, role: "admin" }, // Đối với admin
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          admin_id: user.admin_id,
          name: user.name,
          email: user.email,
          role: "admin",
        },
      });
    }

    // Kiểm tra mật khẩu của user
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Tạo JWT token cho user
    const token = jwt.sign(
      { user_id: user.user_id, role: "user" }, // Đối với user
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "User login successful",
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: "user",
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        phone: user.phone,
        id_card: user.id_card,
        passport: user.passport,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// API đăng ký
const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    email,
    phone,
    password,
    id_card,
    passport,
  } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!first_name || !last_name || !email || !password || !date_of_birth) {
    return res.status(400).json({
      message:
        "Missing required fields: first_name, last_name, email, password, date_of_birth",
    });
  }

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Kiểm tra xem số CMND/CCCD đã tồn tại chưa (nếu có)
    if (id_card) {
      const existingIdCard = await User.findOne({ where: { id_card } });
      if (existingIdCard) {
        return res.status(409).json({ message: "ID card already registered" });
      }
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu thông tin người dùng vào cơ sở dữ liệu
    const user = await User.create({
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone: phone || "",
      password_hash: hashedPassword,
      id_card,
      passport: passport || "",
    });

    res.status(201).json({
      message: "Registration successful",
      user_id: user.user_id,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin registration API
const registerAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check for missing fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Missing required fields: name, email, password" });
  }

  try {
    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin information into the database
    const admin = await Admin.create({
      name,
      email,
      phone: phone || "",
      password_hash: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registration successful",
      admin_id: admin.admin_id,
    });
  } catch (error) {
    console.error("Error during admin registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login, registerUser, registerAdmin };
