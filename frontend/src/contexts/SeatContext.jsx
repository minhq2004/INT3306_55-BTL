// SeatContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [seatType, setSeatType] = useState(null);
  const [passengerCount, setPassengerCount] = useState(0);
  const [seatPrice, setSeatPrice] = useState(0);

  const organizeSeats = (seatsData) => {
    const rows = {};
    seatsData.forEach((seat) => {
      const rowNumber = seat.seat_number.slice(0, -1);
      if (!rows[rowNumber]) {
        rows[rowNumber] = [];
      }
      rows[rowNumber].push({
        ...seat,
        status: seat.status || "available",
      });
    });

    Object.values(rows).forEach((row) => {
      row.sort((a, b) => a.seat_number.localeCompare(b.seat_number));
    });

    return Object.entries(rows)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([rowNumber, seats]) => ({
        rowNumber,
        seats,
      }));
  };

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

  const selectSeat = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      if (prev.length < passengerCount) {
        return [...prev, seatId];
      }
      return prev;
    });
  };

  const initializeSelection = ({ type, count, price }) => {
    setSeatType(type);
    setPassengerCount(count);
    setSeatPrice(price);
    setSelectedSeats([]);
    setError(null);
  };

  const resetSelection = () => {
    setSelectedSeats([]);
    setError(null);
  };

  const getTotalPrice = () => selectedSeats.length * seatPrice;

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

export const useSeat = () => {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeat must be used within a SeatProvider");
  }
  return context;
};
