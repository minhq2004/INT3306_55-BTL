const { Service } = require("../models"); // Yêu cầu mô hình Service từ models

// Tạo dịch vụ mới
const createService = async (req, res) => {
  const { service_name, service_price } = req.body; // Lấy các tham số từ request body

  // Kiểm tra các trường bắt buộc
  if (!service_name || service_price === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tạo mới dịch vụ trong cơ sở dữ liệu
    const service = await Service.create({
      service_name,
      service_price,
    });

    // Trả về dịch vụ vừa tạo
    res.status(201).json({
      message: "Service create successful",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lấy danh sách tất cả dịch vụ
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật dịch vụ
const updateService = async (req, res) => {
  const { service_id } = req.params;
  const { service_name, service_price } = req.body;

  if (!service_name || service_price === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Tìm dịch vụ theo ID
    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Cập nhật thông tin dịch vụ
    service.service_name = service_name;
    service.service_price = service_price;
    await service.save();

    res.status(200).json({
      message: "Service update successful",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Xóa dịch vụ
const deleteService = async (req, res) => {
  const { service_id } = req.params;

  try {
    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Xóa dịch vụ
    await service.destroy();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};
