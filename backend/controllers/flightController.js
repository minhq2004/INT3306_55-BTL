const { Airplane, Flight, Seat } = require("../models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// Lấy tất cả các chuyến bay với thông tin máy bay và giá ghế cho từng hạng
const getAllFlights = async (req, res) => {
  const { page = 1, limit = 10 } = req.params; // Lấy page và limit từ params

  // Chuyển page và limit sang kiểu số và tính offset
  const offset = (page - 1) * limit;

  try {
    // Lấy danh sách chuyến bay với phân trang
    const flights = await Flight.findAll({
      include: [
        {
          model: Airplane, // Kết hợp bảng Airplane với Flight
          attributes: ["airplane_id", "model", "manufacturer", "total_seats"], // Chỉ lấy thuộc tính của máy bay
        },
        {
          model: Seat, // Kết hợp bảng Seat với Flight
          attributes: ["seat_type", "seat_price", "status"], // Lấy thông tin giá ghế theo loại ghế
        },
      ],
      limit: parseInt(limit), // Số lượng kết quả mỗi trang
      offset: parseInt(offset), // Dịch chuyển số lượng kết quả đã lấy
      order: [
        ["departure_date", "ASC"], // Sắp xếp theo thời gian khởi hành
        ["departure_time", "ASC"], // Sắp xếp theo giờ khởi hành
      ],
    });

    // Kiểm tra nếu không có chuyến bay nào
    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found" });
    }

    // Nếu chỉ có 1 chuyến bay, xử lý nó như một đối tượng duy nhất
    const result =
      flights.length === 1
        ? processFlight(flights[0])
        : flights.map(processFlight);

    // Trả về dữ liệu phân trang
    const totalFlights = await Flight.count(); // Tổng số chuyến bay trong cơ sở dữ liệu
    const totalPages = Math.ceil(totalFlights / limit); // Tính tổng số trang

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total_flights: totalFlights,
      total_pages: totalPages,
      data: result, // Dữ liệu chuyến bay đã được xử lý
    });
  } catch (error) {
    console.error("Error fetching flights:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lấy thong tin chi tiet mot chuyến bay với thông tin máy bay và giá ghế cho từng hạng
const getFlightDetails = async (req, res) => {
  const { flight_id } = req.params; // Lấy flight_id từ params

  try {
    // Tìm chuyến bay theo flight_id
    const flight = await Flight.findByPk(flight_id, {
      include: [
        {
          model: Airplane, // Kết hợp bảng Airplane với Flight
          attributes: ["airplane_id", "model", "manufacturer", "total_seats"], // Chỉ lấy thuộc tính của máy bay
        },
        {
          model: Seat, // Kết hợp bảng Seat với Flight
          attributes: ["seat_type", "seat_price", "status"], // Lấy thông tin giá ghế theo loại ghế
        },
      ],
      order: [["departure_time", "ASC"]], // Sắp xếp theo thời gian khởi hành
    });

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Sử dụng processFlight để xử lý thông tin chuyến bay
    const result = processFlight(flight);

    // Trả về kết quả chuyến bay chi tiết
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching flight details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Tìm kiếm chuyến bay một chiều
const searchOneWayFlights = async (req, res) => {
  const { departure, destination, departure_date, amount } = req.params;

  try {
    // Parse ngày từ departure_date
    const formattedDate = new Date(departure_date).toISOString().split("T")[0];

    // Tìm kiếm chuyến bay một chiều (outbound) trong ngày departure_time
    const flights = await Flight.findAll({
      where: {
        departure,
        destination,
        departure_date: formattedDate, // So sánh chỉ ngày departure_date
      },
      order: [["departure_time", "ASC"]],
      include: [
        {
          model: Airplane,
          attributes: ["airplane_id", "model", "manufacturer", "total_seats"],
        },
        {
          model: Seat,
          attributes: ["seat_type", "seat_price", "status"],
          where: { status: "available" }, // Chỉ lấy ghế còn available
        },
      ],
    });

    // Lọc các chuyến bay có số ghế còn lại >= amount
    const availableFlights = flights.filter((flight) => {
      const availableSeats = flight.Seats.length; // Số ghế còn available
      return availableSeats >= amount;
    });

    if (availableFlights.length === 0) {
      return res
        .status(404)
        .json({ message: "No flights found with sufficient seats" });
    }

    // Lọc và trả về giá ghế cho chuyến bay một chiều
    const result =
      availableFlights.length === 1
        ? processFlight(availableFlights[0])
        : availableFlights.map(processFlight);

    // Trả về kết quả với thông tin chuyến bay và giá các loại ghế
    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching one-way flights:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Hàm xử lý chuyến bay và giá ghế tra ve
const processFlight = (flight) => {
  const seatPrices = {
    economy: 0,
    business: 0,
    "first class": 0,
  };

  const availableSeats = {
    economy: 0,
    business: 0,
    "first class": 0,
  };

  // Lọc và đếm số ghế còn available cho từng loại ghế trong chuyến bay
  flight.Seats.forEach((seat) => {
    if (seat.status === "available") {
      // Cập nhật giá cho từng loại ghế
      seatPrices[seat.seat_type] = seat.seat_price;
      // Đếm số ghế còn available theo từng loại
      availableSeats[seat.seat_type] += 1;
    }
  });

  return {
    flight_id: flight.flight_id,
    flight_number: flight.flight_number,
    departure: flight.departure,
    destination: flight.destination,
    departure_date: flight.departure_date,
    departure_time: flight.departure_time,
    arrival_date: flight.arrival_date,
    arrival_time: flight.arrival_time,
    status: flight.status,
    airplane_id: flight.Airplane.airplane_id,
    model: flight.Airplane.model,
    manufacturer: flight.Airplane.manufacturer,
    total_seats: flight.Airplane.total_seats,
    economy_price: seatPrices["economy"],
    business_price: seatPrices["business"],
    first_class_price: seatPrices["first class"],
    economy_available: availableSeats["economy"], // Số ghế economy còn available
    business_available: availableSeats["business"], // Số ghế business còn available
    first_class_available: availableSeats["first class"], // Số ghế first class còn available
  };
};

// Tìm kiếm chuyến bay khứ hồi
const searchRoundTripFlights = async (req, res) => {
  const { departure, destination, departure_date, return_date, amount } =
    req.params;

  try {
    // Parse ngày từ departure_time và return_time
    const formattedDeparture = new Date(departure_date)
      .toISOString()
      .split("T")[0]; // Chỉ lấy phần ngày (YYYY-MM-DD)
    const formattedReturn = new Date(return_date).toISOString().split("T")[0]; // Chỉ lấy phần ngày (YYYY-MM-DD)

    // Tìm kiếm chuyến bay đi (outbound) trong ngày departure_time
    const outboundFlights = await Flight.findAll({
      where: {
        departure,
        destination,
        departure_date: formattedDeparture,
      },
      order: [["departure_time", "ASC"]],
      include: [
        {
          model: Airplane,
          attributes: ["airplane_id", "model", "manufacturer", "total_seats"],
        },
        {
          model: Seat,
          attributes: ["seat_type", "seat_price", "status"],
        },
      ],
    });

    if (outboundFlights.length === 0) {
      return res.status(404).json({ message: "No outbound flights found" });
    }

    // Lọc chuyến bay đi (outbound) chỉ lấy chuyến bay có đủ số ghế còn available
    const outboundResult = outboundFlights
      .filter((flight) => {
        const availableSeats = countAvailableSeats(flight, amount);
        return availableSeats >= amount;
      })
      .map(processFlight);

    if (outboundResult.length === 0) {
      return res.status(404).json({
        message: "No outbound flights with enough available seats found",
      });
    }

    // Tìm kiếm chuyến bay về (inbound) trong ngày return_time
    const inboundFlights = await Flight.findAll({
      where: {
        departure: destination,
        destination: departure,
        departure_date: formattedReturn,
      },
      order: [["departure_time", "ASC"]],
      include: [
        {
          model: Airplane,
          attributes: ["airplane_id", "model", "manufacturer", "total_seats"],
        },
        {
          model: Seat,
          attributes: ["seat_type", "seat_price", "status"],
        },
      ],
    });

    if (inboundFlights.length === 0) {
      return res.status(404).json({ message: "No inbound flights found" });
    }

    // Lọc chuyến bay về (inbound) chỉ lấy chuyến bay có đủ số ghế còn available
    const inboundResult = inboundFlights
      .filter((flight) => {
        const availableSeats = countAvailableSeats(flight, amount);
        return availableSeats >= amount;
      })
      .map(processFlight);

    if (inboundResult.length === 0) {
      return res.status(404).json({
        message: "No inbound flights with enough available seats found",
      });
    }

    // Trả về kết quả với cả chuyến bay đi và về
    res.status(200).json({
      outboundFlights: outboundResult,
      inboundFlights: inboundResult,
    });
  } catch (error) {
    console.error("Error searching roundtrip flights:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dem so ghe con kha dung
const countAvailableSeats = (flight, amount) => {
  let availableSeats = 0;

  // Duyệt qua tất cả ghế và đếm số ghế còn sẵn cho từng loại ghế
  flight.Seats.forEach((seat) => {
    if (seat.status === "available") {
      availableSeats++;
    }
  });

  return availableSeats;
};

const createSeatsForFlight = async (
  flight_id,
  airplane_id,
  economy_price,
  business_price,
  first_class_price
) => {
  try {
    // Lấy thông tin máy bay
    const airplane = await Airplane.findOne({
      where: { airplane_id },
      attributes: ["total_seats"],
    });
    if (!airplane) throw new Error("Airplane not found");

    const totalSeats = airplane.total_seats;

    // Số ghế business và economy
    const firstClassSeats = 16;
    const businessSeats = 30;
    const economySeats = totalSeats - businessSeats - firstClassSeats;

    const seatData = [];
    let rowNumber = 1; // Biến đếm số hàng ghế
    let seatLabel = ""; // Biến lưu mã ghế (ví dụ: 1A, 1B, ...)

    // Tạo ghế cho first class (16 ghế đầu tiên, mỗi hàng 4 ghế)
    for (let i = 0; i < firstClassSeats; i++) {
      const seatType = "first class";
      seatLabel = `${rowNumber}${["A", "B", "C", "D"][i % 4]}`; // Chia ghế theo hàng A, B, C, D
      seatData.push({
        flight_id,
        seat_number: seatLabel,
        seat_type: seatType,
        status: "available",
        seat_price: first_class_price,
      });
      if ((i + 1) % 4 === 0) rowNumber++; // Sau mỗi 4 ghế, tăng số hàng
    }

    // Tạo ghế cho business class (phần còn lại, mỗi hàng 6 ghế)
    for (let i = 0; i < businessSeats; i++) {
      const seatType = "business";
      seatLabel = `${rowNumber}${["A", "B", "C", "D", "E", "F"][i % 6]}`; // Chia ghế theo hàng A, B, C, D, E, F
      seatData.push({
        flight_id,
        seat_number: seatLabel,
        seat_type: seatType,
        status: "available",
        seat_price: business_price,
      });
      if ((i + 1) % 6 === 0) rowNumber++; // Sau mỗi 6 ghế, tăng số hàng
    }

    // Tạo ghế cho economy class (phần còn lại, mỗi hàng 6 ghế)
    for (let i = 0; i < economySeats; i++) {
      const seatType = "economy";
      seatLabel = `${rowNumber}${["A", "B", "C", "D", "E", "F"][i % 6]}`; // Chia ghế theo hàng A, B, C, D, E, F
      seatData.push({
        flight_id,
        seat_number: seatLabel,
        seat_type: seatType,
        status: "available",
        seat_price: economy_price,
      });
      if ((i + 1) % 6 === 0) rowNumber++; // Sau mỗi 6 ghế, tăng số hàng
    }

    // Sắp xếp lại seatData theo seat_number để đảm bảo thứ tự đúng
    seatData.sort((a, b) => {
      const seatNumberA = a.seat_number;
      const seatNumberB = b.seat_number;

      const rowA = parseInt(seatNumberA, 10);
      const rowB = parseInt(seatNumberB, 10);
      const letterA = seatNumberA.slice(-1);
      const letterB = seatNumberB.slice(-1);

      if (rowA !== rowB) return rowA - rowB; // Sắp xếp theo số hàng
      return letterA.localeCompare(letterB); // Sắp xếp theo ký tự ghế
    });

    // Chèn tất cả ghế vào cơ sở dữ liệu
    await Seat.bulkCreate(seatData);

    console.log(
      `Created ${totalSeats} seats (First Class: ${firstClassSeats}, Business: ${businessSeats}, Economy: ${economySeats}) for flight ${flight_id}`
    );
  } catch (error) {
    console.error("Error creating seats:", error.message);
    throw error;
  }
};

// Tạo chuyến bay
const createFlight = async (req, res) => {
  const {
    flight_number,
    airplane_id,
    departure,
    destination,
    departure_date,
    departure_time,
    arrival_date,
    arrival_time,
    economy_price,
    business_price,
    first_class_price,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (
    !flight_number ||
    !airplane_id ||
    !departure ||
    !destination ||
    !departure_date ||
    !departure_time ||
    !arrival_date ||
    !arrival_time ||
    !economy_price ||
    !business_price ||
    !first_class_price
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Kiểm tra sự tồn tại của máy bay
    const airplane = await Airplane.findOne({ where: { airplane_id } });
    if (!airplane) {
      return res.status(404).json({ message: "Airplane not found" });
    }

    // Tạo chuyến bay mới
    const flight = await Flight.create({
      flight_number,
      airplane_id,
      departure,
      destination,
      departure_date,
      departure_time,
      arrival_date,
      arrival_time,
    });

    // Tạo ghế cho chuyến bay và giá (giả sử có một hàm tạo ghế sẵn)
    await createSeatsForFlight(
      flight.flight_id,
      airplane_id,
      economy_price,
      business_price,
      first_class_price
    );

    // Trả về thông báo thành công
    res.status(201).json({
      message: "Flight created successfully",
      flight_id: flight.flight_id,
    });
  } catch (error) {
    console.error("Error creating flight:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cập nhật chuyến bay
const updateFlight = async (req, res) => {
  const { flight_id } = req.params;
  const {
    flight_number,
    departure,
    destination,
    departure_date,
    departure_time,
    arrival_date,
    arrival_time,
    status,
  } = req.body;

  if (
    !flight_number ||
    !departure ||
    !destination ||
    !departure_date ||
    !departure_time ||
    !arrival_date ||
    !arrival_time
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Cập nhật chuyến bay
    const flight = await Flight.findByPk(flight_id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    await flight.update({
      flight_number,
      departure,
      destination,
      departure_date,
      departure_time,
      arrival_date,
      arrival_time,
      status: status || "scheduled", // nếu không có status, mặc định là "scheduled"
    });

    res.status(200).json({ message: "Flight updated successfully" });
  } catch (error) {
    console.error("Error updating flight:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Xoa chuyen bay
const deleteFlight = async (req, res) => {
  const { flight_id } = req.params;

  try {
    // Tìm chuyến bay theo flight_id
    const flight = await Flight.findByPk(flight_id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // Xóa chuyến bay
    await flight.destroy();

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Error deleting flight:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Thong ke chuyen bay
const getFlightStatistic = async (req, res) => {
  try {
    const stats = await Flight.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("flight_id")), "total_flights"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END"
            )
          ),
          "scheduled_flights",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "CASE WHEN status = 'completed' THEN 1 ELSE 0 END"
            )
          ),
          "completed_flights",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'canceled' THEN 1 ELSE 0 END")
          ),
          "canceled_flights",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'delayed' THEN 1 ELSE 0 END")
          ),
          "delayed_flights",
        ],
      ],
      raw: true, // Trả về kết quả thô, không có kiểu dữ liệu của Sequelize
    });

    // Trả về thống kê kết quả đầu tiên
    res.status(200).json(stats[0]);
  } catch (error) {
    console.error("Error fetching flight statistics:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllFlights,
  searchOneWayFlights,
  searchRoundTripFlights,
  getFlightDetails,
  createFlight,
  updateFlight,
  deleteFlight,
  getFlightStatistic,
};
