import { create } from "zustand";
import axios from "axios";

const useFlightStore = create((set, get) => ({
  // Tham số tìm kiếm chuyến bay
  searchParams: {
    departure: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      minors: 0,
    },
    passengersDisplay: "1 Adult - 0 Minor", // Hiển thị số lượng hành khách
  },

  // Kết quả tìm kiếm chuyến bay
  oneWayFlights: [],
  outboundFlights: [],
  inboundFlights: [],
  loading: false,
  error: null,

  // Thông tin chuyến bay và đặt chỗ đã chọn
  selectedFlight: null,
  selectedTicketType: null,
  selectedSeat: null,
  selectedSeats: [],

  // Các hàm xử lý tham số tìm kiếm
  setSearchParams: (params) => {
    set((state) => ({
      searchParams: {
        ...state.searchParams,
        ...params,
      },
    }));
  },

  // Cập nhật số lượng hành khách
  updatePassengers: (adults, minors) => {
    set((state) => ({
      searchParams: {
        ...state.searchParams,
        passengers: {
          adults,
          minors,
        },
        passengersDisplay: `${adults} Adult - ${minors} Minor`,
      },
    }));
  },

  // Thiết lập tham số tìm kiếm từ URL
  setSearchParamsFromUrl: (params) => {
    const amount = parseInt(params.amount, 10) || 1;

    set((state) => ({
      searchParams: {
        ...state.searchParams,
        departure: params.departure || "",
        destination: params.destination || "",
        departureDate: params.departure_time || "",
        returnDate: params.return_time || "",
        passengers: {
          adults: amount, // Set adults to amount from URL
          minors: 0,
        },
        passengersDisplay: `${amount} Adult - 0 Minor`,
      },
    }));
  },

  // Tìm kiếm chuyến bay một chiều
  searchOneWayFlights: async () => {
    const { searchParams } = get();
    const totalPassengers =
      searchParams.passengers.adults + searchParams.passengers.minors;

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/flights/oneway/${searchParams.departure}/${searchParams.destination}/${searchParams.departureDate}/${totalPassengers}`
      );

      const flightData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      set({
        oneWayFlights: flightData,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error fetching flights",
        loading: false,
      });
    }
  },

  // Tìm kiếm chuyến bay khứ hồi
  searchRoundtripFlights: async () => {
    const { searchParams } = get();
    const totalPassengers =
      searchParams.passengers.adults + searchParams.passengers.minors;

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/flights/roundtrip/${searchParams.departure}/${searchParams.destination}/${searchParams.departureDate}/${searchParams.returnDate}/${totalPassengers}`
      );

      set({
        outboundFlights: response.data.outboundFlights,
        inboundFlights: response.data.inboundFlights,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Error fetching flights",
        loading: false,
      });
    }
  },

// Các hàm xử lý lựa chọn
selectFlight: (flight, ticketType) => {
  set({
    selectedFlight: flight,
    selectedTicketType: ticketType,
  });
},

// Chọn ghế ngồi
selectSeat: (seat) => {
  set({ selectedSeat: seat });
},

// Thêm ghế đã chọn vào danh sách
addSelectedSeat: (seat) =>
  set((state) => ({
    selectedSeats: [...state.selectedSeats, seat],
  })),

// Xóa ghế khỏi danh sách đã chọn
removeSelectedSeat: (seatId) =>
  set((state) => ({
    selectedSeats: state.selectedSeats.filter((s) => s.seat_id !== seatId),
  })),

// Đặt lại danh sách ghế đã chọn
resetSeats: () => set({ selectedSeats: [] }),

// Các hàm đặt lại trạng thái
resetSelection: () => {
  set({
    selectedFlight: null,
    selectedTicketType: null,
    selectedSeat: null,
    selectedSeats: [],
  });
},

// Đặt lại kết quả tìm kiếm
resetSearch: () => {
  set({
    oneWayFlights: [],
    outboundFlights: [],
    inboundFlights: [],
    error: null,
    selectedFlight: null,
    selectedTicketType: null,
    selectedSeat: null,
    selectedSeats: [],
  });
},

// Lấy tổng số hành khách
getTotalPassengers: () => {
  const { searchParams } = get();
  return searchParams.passengers.adults + searchParams.passengers.minors;
},

// Lấy số ghế còn trống theo loại vé
getAvailableSeats: () => {
  const { selectedFlight, selectedTicketType } = get();
  if (!selectedFlight || !selectedTicketType) return 0;

  switch (selectedTicketType.toLowerCase()) {
    case "economy":
      return selectedFlight.economy_available;
    case "business":
      return selectedFlight.business_available;
    case "first class":
      return selectedFlight.first_class_available;
    default:
      return 0;
  }
},

// Lấy giá vé theo loại vé đã chọn
getTicketPrice: () => {
  const { selectedFlight, selectedTicketType } = get();
  if (!selectedFlight || !selectedTicketType) return 0;

  switch (selectedTicketType.toLowerCase()) {
    case "economy":
      return selectedFlight.economy_price;
    case "business":
      return selectedFlight.business_price;
    case "first class":
      return selectedFlight.first_class_price;
    default:
      return 0;
  }
},
}));

export default useFlightStore;