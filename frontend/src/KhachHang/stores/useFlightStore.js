import { create } from "zustand";
import axios from "axios";

const useFlightStore = create((set, get) => ({
  // Search Parameters
  searchParams: {
    departure: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      minors: 0,
    },
    passengersDisplay: "1 Adult - 0 Minor",
  },

  // Flight Results
  oneWayFlights: [],
  outboundFlights: [],
  inboundFlights: [],
  loading: false,
  error: null,

  // Selected Flight & Booking
  selectedFlight: null,
  selectedTicketType: null,
  selectedSeat: null,
  selectedSeats: [],

  // Search Parameters Actions
  setSearchParams: (params) => {
    set((state) => ({
      searchParams: {
        ...state.searchParams,
        ...params,
      },
    }));
  },

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

  // Flight Search Actions
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

  // Selection Actions
  selectFlight: (flight, ticketType) => {
    set({
      selectedFlight: flight,
      selectedTicketType: ticketType,
    });
  },

  selectSeat: (seat) => {
    set({ selectedSeat: seat });
  },

  addSelectedSeat: (seat) =>
    set((state) => ({
      selectedSeats: [...state.selectedSeats, seat],
    })),

  removeSelectedSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s.seat_id !== seatId),
    })),

  resetSeats: () => set({ selectedSeats: [] }),

  // Reset Actions
  resetSelection: () => {
    set({
      selectedFlight: null,
      selectedTicketType: null,
      selectedSeat: null,
      selectedSeats: [],
    });
  },

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

  // Utility Getters
  getTotalPassengers: () => {
    const { searchParams } = get();
    return searchParams.passengers.adults + searchParams.passengers.minors;
  },

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
