const { Discount } = require("../models"); // Yêu cầu mô hình Discount từ models

// Lấy danh sách tất cả discount
const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.findAll(); // Lấy tất cả discount từ bảng "discounts"
    res.status(200).json(discounts); // Trả về danh sách discount dưới dạng JSON
  } catch (error) {
    console.error("Error fetching discounts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Tạo discount mới
const createDiscount = async (req, res) => {
  const { code, discount_percentage } = req.body; // Lấy các tham số từ request body

  // Kiểm tra các trường bắt buộc
  if (!code || discount_percentage === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tạo mới discount trong cơ sở dữ liệu
    const newDiscount = await Discount.create({
      code,
      discount_percentage,
    });

    // Trả về discount vừa tạo
    res.status(201).json(newDiscount);
  } catch (error) {
    console.error("Error creating discount:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật discount
const updateDiscount = async (req, res) => {
  const { discount_id } = req.params; // Lấy discount_id từ params
  const { code, discount_percentage } = req.body; // Lấy các tham số từ request body

  if (!code || discount_percentage === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tìm discount theo ID
    const discount = await Discount.findByPk(discount_id);

    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    // Cập nhật thông tin discount
    discount.code = code;
    discount.discount_percentage = discount_percentage;
    await discount.save(); // Lưu lại thay đổi

    res.status(200).json(discount); // Trả về discount đã được cập nhật
  } catch (error) {
    console.error("Error updating discount:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Xóa discount
const deleteDiscount = async (req, res) => {
  const { discount_id } = req.params; // Lấy discount_id từ params

  try {
    const discount = await Discount.findByPk(discount_id);

    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    // Xóa discount
    await discount.destroy(); // Xóa discount khỏi cơ sở dữ liệu

    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    console.error("Error deleting discount:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
