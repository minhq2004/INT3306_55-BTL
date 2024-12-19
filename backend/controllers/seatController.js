// Working
const { Seat } = require("../models"); // Yêu cầu tất cả các mô hình từ models/index.js

// Lấy danh sách ghế trống
const getAvailableSeatType = async (req, res) => {
  const { flight_id, seat_type } = req.params;

  if (!flight_id) {
    return res
      .status(400)
      .json({ message: "Missing required parameter: flight_id" });
  }

  // Kiểm tra nếu seat_type có hợp lệ không
  const validSeatTypes = ["economy", "business", "first class"];
  if (seat_type && !validSeatTypes.includes(seat_type)) {
    return res.status(400).json({ message: "Invalid seat_type" });
  }

  try {
    // Query để lấy các ghế trống theo flight_id và seat_type nếu có
    const seats = await Seat.findAll({
      where: {
        flight_id, // Lọc theo flight_id
        status: "available", // Chỉ lấy ghế trống
        ...(seat_type && { seat_type }), // Nếu seat_type được cung cấp, lọc thêm theo seat_type
      },
      attributes: [
        "seat_id",
        "flight_id",
        "seat_number",
        "seat_type",
        "seat_price",
      ], // Lọc các thuộc tính cần thiết
      order: [["seat_id", "ASC"]], // Sắp xếp theo seat_id hoặc seat_number
    });

    if (seats.length === 0) {
      return res
        .status(404)
        .json({ message: "No available seats for the given flight" });
    }
    const seatsData = seats.map((seat) => seat.toJSON());
    res.status(200).json(seatsData);
  } catch (error) {
    console.error("Error fetching available seats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lấy danh sách ghế trống
const getAllStatusSeatType = async (req, res) => {
  const { flight_id, seat_type } = req.params;

  if (!flight_id) {
    return res
      .status(400)
      .json({ message: "Missing required parameter: flight_id" });
  }

  // Kiểm tra nếu seat_type có hợp lệ không
  const validSeatTypes = ["economy", "business", "first class"];
  if (seat_type && !validSeatTypes.includes(seat_type)) {
    return res.status(400).json({ message: "Invalid seat_type" });
  }

  try {
    // Query để lấy các ghế trống theo flight_id và seat_type nếu có
    const seats = await Seat.findAll({
      where: {
        flight_id, // Lọc theo flight_id
        ...(seat_type && { seat_type }), // Nếu seat_type được cung cấp, lọc thêm theo seat_type
      },
      attributes: [
        "seat_id",
        "flight_id",
        "seat_number",
        "seat_type",
        "seat_price",
        "status",
      ], // Lọc các thuộc tính cần thiết
      order: [["seat_id", "ASC"]], // Sắp xếp theo seat_id hoặc seat_number
    });

    if (seats.length === 0) {
      return res
        .status(404)
        .json({ message: "No available seats for the given flight" });
    }
    const seatsData = seats.map((seat) => seat.toJSON());
    res.status(200).json(seatsData);
  } catch (error) {
    console.error("Error fetching available seats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSeat = async (req, res) => {
  const { flight_id } = req.params;

  if (!flight_id) {
    return res
      .status(400)
      .json({ message: "Missing required parameter: flight_id" });
  }

  try {
    // Query để lấy các ghế trống theo flight_id và seat_type nếu có
    const seats = await Seat.findAll({
      where: {
        flight_id, // Lọc theo flight_id
      },
      attributes: [
        "seat_id",
        "flight_id",
        "seat_number",
        "seat_type",
        "seat_price",
        "status",
      ], // Lọc các thuộc tính cần thiết
      order: [["seat_id", "ASC"]], // Sắp xếp theo seat_id hoặc seat_number
    });

    if (seats.length === 0) {
      return res
        .status(404)
        .json({ message: "No available seats for the given flight" });
    }
    const seatsData = seats.map((seat) => seat.toJSON());
    res.status(200).json(seatsData);
  } catch (error) {
    console.error("Error fetching available seats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getAvailableSeatType, getAllSeat, getAllStatusSeatType };
