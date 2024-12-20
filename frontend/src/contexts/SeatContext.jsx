// SeatContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  // Các state quản lý thông tin ghế
  const [seats, setSeats] = useState([]); // Danh sách tất cả các ghế
  const [selectedSeats, setSelectedSeats] = useState([]); // Danh sách ghế đã chọn
  const [loading, setLoading] = useState(false); // Trạng thái đang tải
  const [error, setError] = useState(null); // Thông tin lỗi
  const [seatType, setSeatType] = useState(null); // Loại ghế (thương gia/phổ thông)
  const [passengerCount, setPassengerCount] = useState(0); // Số lượng hành khách
  const [seatPrice, setSeatPrice] = useState(0); // Giá ghế

  // Sắp xếp ghế theo hàng và vị trí
  const organizeSeats = (seatsData) => {
    // Tạo object lưu trữ ghế theo hàng
    const rows = {};
    seatsData.forEach((seat) => {
      const rowNumber = seat.seat_number.slice(0, -1);
      if (!rows[rowNumber]) {
        rows[rowNumber] = [];
      }
      rows[rowNumber].push({
        ...seat,
        status: seat.status || "available", // Gán trạng thái mặc định nếu chưa có
      });
    });

    // Sắp xếp ghế trong mỗi hàng theo thứ tự chữ cái
    Object.values(rows).forEach((row) => {
      row.sort((a, b) => a.seat_number.localeCompare(b.seat_number));
    });

    // Chuyển đổi thành mảng và sắp xếp theo số thứ tự hàng
    return Object.entries(rows)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([rowNumber, seats]) => ({
        rowNumber,
        seats,
      }));
  };

  // Lấy thông tin ghế từ API
  const fetchSeats = async (flightId, type) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:3000/api/public/seats/${flightId}/${type}`
      );

      const organizedSeats = organizeSeats(response.data);
      setSeats(organizedSeats);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải thông tin ghế ngồi"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn/bỏ chọn ghế
  const selectSeat = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Nếu ghế đã được chọn, bỏ chọn ghế đó
        return prev.filter((id) => id !== seatId);
      }
      if (prev.length < passengerCount) {
        // Nếu chưa đủ số lượng ghế cần chọn, thêm ghế mới
        return [...prev, seatId];
      }
      return prev;
    });
  };

  // Khởi tạo thông tin chọn ghế
  const initializeSelection = ({ type, count, price }) => {
    setSeatType(type);
    setPassengerCount(count);
    setSeatPrice(price);
    setSelectedSeats([]);
    setError(null);
  };

  // Đặt lại trạng thái chọn ghế
  const resetSelection = () => {
    setSelectedSeats([]);
    setError(null);
  };

  // Tính tổng giá tiền các ghế đã chọn
  const getTotalPrice = () => selectedSeats.length * seatPrice;

  // Giá trị context được cung cấp cho các component con
  return (
    <SeatContext.Provider
      value={{
        seats,
        selectedSeats,
        loading,
        error,
        seatType,
        passengerCount,
        seatPrice,
        fetchSeats,
        selectSeat,
        initializeSelection,
        resetSelection,
        getTotalPrice,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng SeatContext
export const useSeat = () => {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeat must be used within a SeatProvider");
  }
  return context;
};
