const {
  Flight,
  Seat,
  Discount,
  Booking,
  User,
  Service,
  Airplane,
} = require("../models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// API đặt vé Working
const bookTicket = async (req, res) => {
  const user_id = req.user?.user_id;
  const { seat_id, service_id = 1, discount_code = null } = req.body;

  try {
    // Kiểm tra và lấy thông tin ghế từ seat_id
    const seat = await Seat.findByPk(seat_id);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Kiểm tra nếu ghế không có trạng thái "available"
    if (seat.status !== "available") {
      return res.status(400).json({ message: "Seat is not available" });
    }

    // Kiểm tra thông tin chuyến bay tương ứng với seat_id
    const flight = await Flight.findByPk(seat.flight_id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Kiểm tra trạng thái của chuyến bay, chỉ cho phép nếu "scheduled" hoặc "delayed"
    if (flight.status !== "scheduled" && flight.status !== "delayed") {
      return res.status(400).json({
        message:
          "Booking is only allowed for flights with 'scheduled' or 'delayed' status",
      });
    }

    // Kiểm tra và lấy thông tin dịch vụ từ service_id
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Kiểm tra mã giảm giá (nếu có)
    let discount_value = 0;
    if (discount_code) {
      const discount = await Discount.findOne({
        where: { code: discount_code },
      });
      if (discount) {
        discount_value = discount.discount_percentage;
      } else {
        return res.status(404).json({ message: "Invalid discount code" });
      }
    }

    // Tính toán giá vé và giá dịch vụ
    const seat_price = parseFloat(seat.seat_price);
    const service_price = parseFloat(service.service_price);
    discount_value = parseFloat(discount_value);

    // Tính toán tổng giá trị sau khi áp dụng giảm giá
    const total_price =
      (seat_price + service_price) * (1 - discount_value / 100);

    // Tạo booking mới
    const booking = await Booking.create({
      user_id,
      seat_id,
      service_id,
      seat_price,
      service_price,
      discount_value,
      total_price,
    });

    // Cập nhật trạng thái ghế thành "booked"
    seat.status = "booked";
    await seat.save();

    res.status(201).json({
      message: "Ticket booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Error booking ticket:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Working
const cancelBooking = async (req, res) => {
  const { booking_id } = req.params;

  try {
    // Kiểm tra và lấy thông tin booking
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Kiểm tra nếu booking đã bị hủy
    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Booking is already canceled" });
    }

    // Kiểm tra và lấy thông tin ghế từ seat_id của booking
    const seat = await Seat.findByPk(booking.seat_id);
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    // Kiểm tra trạng thái của ghế
    if (seat.status !== "booked") {
      return res.status(400).json({ message: "Seat is not booked" });
    }

    // Kiểm tra thông tin chuyến bay tương ứng với seat_id
    const flight = await Flight.findByPk(seat.flight_id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Kiểm tra trạng thái chuyến bay, chỉ cho phép hủy vé nếu "scheduled" hoặc "delayed"
    if (flight.status !== "scheduled" && flight.status !== "delayed") {
      return res.status(400).json({
        message:
          "Flight status must be 'scheduled' or 'delayed' to cancel booking",
      });
    }

    // Kiểm tra thời gian hủy vé: Chỉ được hủy trước ít nhất 24h so với giờ khởi hành của chuyến bay
    const currentTime = new Date();
    const flightDepartureTime = new Date(`${flight.departure_date}T${flight.departure_time}`);
    const timeDifference = flightDepartureTime - currentTime;

    if (timeDifference <= 24 * 60 * 60 * 1000) {
      // Nếu còn ít hơn 24h, không thể hủy
      return res.status(400).json({
        message:
          "You can only cancel the booking at least 24 hours before the flight departure",
      });
    }

    // Cập nhật trạng thái booking thành 'canceled'
    booking.status = "canceled";
    await booking.save();

    // Cập nhật trạng thái ghế thành 'available'
    seat.status = "available";
    await seat.save();

    res.status(200).json({
      message: "Booking canceled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error canceling booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Xem toan bo ve Working
const getAllBookings = async (req, res) => {
  const { page = 1, limit = 10 } = req.params; // Lấy trang và giới hạn từ query string

  try {
    // Tính toán phân trang (skip và limit)
    const offset = (page - 1) * limit;

    const count = await Booking.count();

    // Lấy danh sách bookings cùng thông tin liên quan
    const bookings = await Booking.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"], // Thông tin người dùng
        },
        {
          model: Seat,
          attributes: ["seat_type"], // Thông tin ghế
          include: [
            {
              model: Flight,
              include: [
                {
                  model: Airplane,
                },
              ],
            },
          ],
        },
        {
          model: Service,
          attributes: ["service_name"], // Thông tin dịch vụ
        },
      ],
      order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian tạo booking mới nhất trước
    });

    // Kiểm tra nếu không có booking nào
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Trả về mảng bookings thuần JSON
    res.status(200).json({
      message: "Bookings retrieved successfully",
      totalBookings: count, // Tổng số bookings
      totalPages: Math.ceil(count / limit), // Tổng số trang
      currentPage: page, // Trang hiện tại
      bookings, // Danh sách bookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Working
const getBookingsByUser = async (req, res) => {
  const user_id = req.user?.user_id;
  const { page = 1, limit = 10 } = req.params; // Lấy page và limit từ query string

  try {
    // Tính toán phân trang (skip và limit)
    const offset = (page - 1) * limit;

    // Truy vấn tổng số booking của user
    const count = await Booking.count({ where: { user_id } });

    // Lấy danh sách bookings của user
    const bookings = await Booking.findAll({
      where: { user_id: user_id }, // Lọc theo user_id
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"], // Thông tin người dùng
        },
        {
          model: Seat,
          attributes: ["seat_type"], // Thông tin ghế
          include: [
            {
              model: Flight,
              include: [
                {
                  model: Airplane,
                },
              ],
            },
          ],
        },
        {
          model: Service,
          attributes: ["service_name"], // Thông tin dịch vụ
        },
      ],
      order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian tạo booking mới nhất trước
    });

    // Kiểm tra nếu không có booking nào
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    // Trả về mảng bookings thuần JSON
    res.status(200).json({
      message: "Bookings retrieved successfully",
      totalBookings: count, // Tổng số máy bay trong cơ sở dữ liệu
      totalPages: Math.ceil(count / limit), // Số trang tổng cộng
      currentPage: page, // Trang hiện tại
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings for user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Thanh toan ve Working
const payForBooking = async (req, res) => {
  try {
    // Lấy booking_id từ request body
    const { booking_id } = req.params;

    // Kiểm tra xem booking_id có hợp lệ không
    if (!booking_id) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    // Tìm booking theo booking_id
    const booking = await Booking.findByPk(booking_id);

    // Nếu không tìm thấy booking, trả về lỗi
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Kiểm tra nếu booking đã được thanh toán (trạng thái khác 'paid')
    if (booking.status === "paid") {
      return res.status(400).json({ error: "Booking has already been paid" });
    }

    if (booking.status === "canceled") {
      return res
        .status(400)
        .json({ error: "Booking has already been canceled" });
    }

    // Cập nhật trạng thái booking thành 'paid'
    booking.status = "paid";
    await booking.save(); // Lưu thay đổi vào cơ sở dữ liệu

    // Trả về thông tin booking sau khi đã cập nhật
    res.status(200).json({
      message: "Booking successfully paid",
      booking: booking.toJSON(),
    });
  } catch (error) {
    console.error("Error during booking payment:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Thống kê đặt vé Working
const getBookingStatistics = async (req, res) => {
  try {
    // 1. Tổng số lượng booking
    const totalBookings = await Booking.count();

    // 2. Booking theo status
    const bookingsByStatus = await Booking.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    // Chuyển đổi kết quả thành object
    const bookingsStatus = {};
    bookingsByStatus.forEach((item) => {
      bookingsStatus[item.status] = parseInt(item.get("count"), 10);
    });

    // 3. Tổng doanh thu chỉ các booking với status 'paid'
    const totalRevenuePaid = await Booking.sum("total_price", {
      where: { status: "paid" },
    });

    // 4. Doanh thu theo từng loại ghế với booking status 'paid'
    const revenueBySeatType = await Booking.findAll({
      attributes: [
        [sequelize.col("Seat.seat_type"), "seat_type"],
        [sequelize.fn("SUM", sequelize.col("Booking.total_price")), "revenue"],
      ],
      include: [
        {
          model: Seat,
          attributes: ["seat_type"], // Đảm bảo lấy 'seat_type' từ Seat
        },
      ],
      where: { status: "paid" }, // Chỉ tính các booking có status 'paid'
      group: ["Seat.seat_type"], // Group theo seat_type để tính doanh thu
    });

    const revenueSeatType = {};
    revenueBySeatType.forEach((item) => {
      const seatType = item.get("seat_type"); // Lấy seat_type chính xác
      if (seatType) {
        revenueSeatType[seatType] = parseFloat(item.get("revenue"));
      }
    });

    // 5. Số lượng đặt vé theo ghế cho toàn bộ các chuyến bay
    const bookingsPerSeatType = await Booking.findAll({
      attributes: [
        [sequelize.col("Seat.seat_type"), "seat_type"],
        [sequelize.fn("COUNT", sequelize.col("Booking.seat_id")), "count"],
      ],
      include: [
        {
          model: Seat,
          attributes: ["seat_type"], // Đảm bảo lấy 'seat_type' từ Seat
        },
      ],
      group: ["Seat.seat_type"], // Group theo seat_type để lấy số lượng
    });

    const countSeatType = {};
    bookingsPerSeatType.forEach((item) => {
      const seatType = item.get("seat_type"); // Lấy seat_type chính xác
      if (seatType) {
        countSeatType[seatType] = parseInt(item.get("count"), 10);
      }
    });

    // 6. Số lượng đặt vé cho từng chuyến bay
    const bookingsPerFlight = await Booking.findAll({
      attributes: [
        [sequelize.col("Seat.Flight.flight_number"), "flight_number"],
        [sequelize.fn("COUNT", sequelize.col("Booking.booking_id")), "count"],
      ],
      include: [
        {
          model: Seat,
          attributes: [], // Không cần 'seat_type', chỉ cần liên kết Seat
          include: [
            {
              model: Flight,
              attributes: ["flight_number"], // Lấy 'flight_number' từ Flight
            },
          ],
        },
      ],
      group: ["Seat.Flight.flight_number"], // Group theo flight_number
    });

    const countPerFlight = {};
    bookingsPerFlight.forEach((item) => {
      const flightNumber = item.get("flight_number"); // Lấy flight_number chính xác
      if (flightNumber) {
        countPerFlight[flightNumber] = parseInt(item.get("count"), 10);
      }
    });

    // Trả về kết quả
    res.json({
      totalBookings,
      bookingsByStatus: bookingsStatus,
      totalRevenuePaid: parseFloat(totalRevenuePaid) || 0,
      revenueBySeatType: revenueSeatType,
      bookingsPerSeatType: countSeatType,
      bookingsPerFlight: countPerFlight,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUpcomingBookings = async (req, res) => {
  const user_id = req.user?.user_id;
  const { page = 1, limit = 10 } = req.params;

  try {
    const offset = (page - 1) * limit;
    const currentTime = new Date();

    // Count total upcoming bookings
    const count = await Booking.count({
      where: {
        user_id: user_id,
        status: { [Op.in]: ["booked", "paid"] },
      },
      include: [{
        model: Seat,
        include: [{
          model: Flight,
          where: {
            [Op.and]: [
              sequelize.literal(
                `TIMESTAMP(CONCAT(departure_date, ' ', departure_time)) > NOW()`
              ),
            ],
          },
        }],
      }],
    });

    const bookings = await Booking.findAll({
      where: {
        user_id: user_id,
        status: { [Op.in]: ["booked", "paid"] },
      },
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ["email", "first_name", "last_name"],
        },
        {
          model: Seat,
          attributes: ["seat_type"],
          include: [
            {
              model: Flight,
              attributes: ["flight_number", "departure_date", "departure_time"],
              where: {
                [Op.and]: [
                  sequelize.literal(
                    `TIMESTAMP(CONCAT(departure_date, ' ', departure_time)) > NOW()`
                  ),
                ],
              },
              include: [
                {
                  model: Airplane,
                  attributes: ["manufacturer", "model"],
                },
              ],
            },
          ],
        },
        {
          model: Service,
          attributes: ["service_name"],
        },
      ],
      order: [
        [Seat, Flight, "departure_date", "ASC"],
        [Seat, Flight, "departure_time", "ASC"],
      ],
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "No upcoming bookings found for this user",
      });
    }

    res.status(200).json({
      message: "Upcoming bookings retrieved successfully",
      totalBookings: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      bookings,
    });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  bookTicket,
  cancelBooking,
  getAllBookings,
  getBookingsByUser,
  payForBooking,
  getBookingStatistics,
  getUpcomingBookings
};
