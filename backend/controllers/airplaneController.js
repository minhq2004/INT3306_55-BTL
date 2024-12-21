const { Airplane } = require("../models");

// Tạo máy bay
const createAirplane = async (req, res) => {
  const { model, manufacturer, total_seats } = req.body;

  // Check for missing required fields
  if (!model || !total_seats) {
    return res.status(400).json({
      message: "Missing required fields: model, total_seats",
    });
  }

  try {
    // Create a new Airplane entry
    const airplane = await Airplane.create({
      model,
      manufacturer: manufacturer || "", // Use empty string if manufacturer is not provided
      total_seats,
    });

    // Respond with the created airplane's ID
    res.status(201).json({
      message: "Airplane created successfully",
      airplane_id: airplane.airplane_id, // Access the generated airplane_id
    });
  } catch (error) {
    console.error("Error creating airplane:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lấy danh sách máy bay
const getAirplanes = async (req, res) => {
  try {
    // Lấy số trang từ params, mặc định là 1 nếu không có
    const page = parseInt(req.params.page) || 1;

    // Số máy bay mỗi trang mặc định là 10
    const pageSize = 10;

    // Tính toán offset (dữ liệu bỏ qua)
    const offset = (page - 1) * pageSize;

    // Truy vấn tất cả máy bay từ bảng airplanes với phân trang và sắp xếp theo airplane_id
    const { rows: airplanes, count } = await Airplane.findAndCountAll({
      order: [["airplane_id", "ASC"]], // Sắp xếp theo airplane_id tăng dần
      limit: pageSize,
      offset: offset,
    });

    if (airplanes.length === 0) {
      return res.status(404).json({ message: "No airplanes found" });
    }

    res.status(200).json({
      message: "Airplanes retrieved successfully",
      totalAirplanes: count, // Tổng số máy bay trong cơ sở dữ liệu
      totalPages: Math.ceil(count / pageSize), // Số trang tổng cộng
      currentPage: page, // Trang hiện tại
      airplanes,
    });
  } catch (error) {
    console.error("Error fetching airplanes:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật máy bay
const updateAirplane = async (req, res) => {
  const { airplane_id } = req.params;
  const { model, manufacturer, total_seats } = req.body;

  // Check for missing fields
  if (!model || !total_seats) {
    return res
      .status(400)
      .json({ message: "Missing required fields: model, total_seats" });
  }

  try {
    // Update airplane information using Sequelize
    const [updatedRows] = await Airplane.update(
      {
        model,
        manufacturer: manufacturer || "",
        total_seats,
      },
      {
        where: {
          airplane_id,
        },
      }
    );

    // If no rows were updated, it means the airplane was not found
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Airplane not found" });
    }

    res.status(200).json({ message: "Airplane updated successfully" });
  } catch (error) {
    console.error("Error updating airplane:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Xóa máy bay
const deleteAirplane = async (req, res) => {
  const { airplane_id } = req.params;

  try {
    // Delete the airplane using Sequelize's destroy method
    const deletedRows = await Airplane.destroy({
      where: {
        airplane_id,
      },
    });

    // If no rows were deleted, it means the airplane was not found
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Airplane not found" });
    }

    res.status(200).json({ message: "Airplane deleted successfully" });
  } catch (error) {
    console.error("Error deleting airplane:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRCMAirplanes = async (req, res) => {
  try {
    const airplanes = await Airplane.findAll({
      attributes: ["airplane_id", "model"],
      order: [["model", "ASC"]],
    });

    res.json(airplanes);
  } catch (error) {
    console.error("Error fetching airplanes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAirplane,
  getAirplanes,
  updateAirplane,
  deleteAirplane,
  getRCMAirplanes,
};
