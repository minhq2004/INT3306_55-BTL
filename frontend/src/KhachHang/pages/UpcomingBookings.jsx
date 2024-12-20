import { useState, useEffect } from "react";
import axios from "axios";

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/bookings/user/upcoming?page=${currentPage}&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBookings(response.data.bookings);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
        setLoading(false);
      }
    };

    fetchUpcomingBookings();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No upcoming bookings found
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upcoming Flights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            {/* Booking Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Flight {booking.Seat.Flight.flight_number}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Flight Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {/* Passenger Info */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Passenger</p>
                  <p className="text-gray-700">
                    {booking.User.first_name} {booking.User.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{booking.User.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Departure</p>
                  <p className="text-gray-700">
                    {new Date(
                      `${booking.Seat.Flight.departure_date} ${booking.Seat.Flight.departure_time}`
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Aircraft</p>
                  <p className="text-gray-700">
                    {booking.Seat.Flight.Airplane.manufacturer}
                    <span className="text-gray-500 text-sm ml-2">
                      ({booking.Seat.Flight.Airplane.model})
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Seat Type</p>
                  <p className="text-gray-700">{booking.Seat.seat_type}</p>
                </div>
              </div>

              {/* Services */}
              {booking.Services && booking.Services.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Additional Services
                  </p>
                  <ul className="space-y-1">
                    {booking.Services.map((service, index) => (
                      <li key={index} className="text-gray-600 text-sm">
                        • {service.service_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;
