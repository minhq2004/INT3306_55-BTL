import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingStatistics from "../components/BookingStatistics";

const adminToken = localStorage.getItem("adminToken");

// Hàm format ngày giờ sang định dạng dd/mm/yyyy, hh:mm
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const QuanLyDatVe = () => {
  // State quản lý danh sách đặt vé
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Các state quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Fetch API lấy dữ liệu từ backend
  const fetchBookings = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/bookings/page/${page}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const { totalPages, totalBookings, bookings } = response.data;
      setBookings(bookings);
      setTotalBookings(totalBookings);
      setTotalPages(totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Something went wrong"); // Lưu message lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBookings(newPage);
    }
  };

  // Hiển thị lỗi và tải nếu có
  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-2">
      <div className="h-full w-full overflow-auto">
        <BookingStatistics></BookingStatistics>
      </div>
      <div className="h-full p-4 bg-white rounded-lg shadow-md overflow-auto">
        <h3 className="font-bold text-xl mt-2">Booking List</h3>

        {bookings.length > 0 ? (
          <table className="hidden lg:table min-w-full border overflow-hidden border-gray-200 mt-4 table-auto border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <thead>
              <tr className="bg-gray-200 text-xs">
                <th className="py-2 px-4 rounded-l-[20px] w-2 text-nowrap">
                  Booking ID
                </th>
                <th className="py-2 px-4">User ID</th>
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">Seat Type</th>
                <th className="py-2 px-4">Flight Number</th>
                <th className="py-2 px-4">Booking Date</th>
                <th className="py-2 px-4">Total Price</th>
                <th className="py-2 px-4 rounded-r-[20px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.booking_id}
                  className="even:bg-gray-100 text-sm"
                >
                  <td className="py-2 px-4">{booking.booking_id}</td>
                  <td className="py-2 px-4">{booking.user_id}</td>
                  <td className="py-2 px-4">
                    {booking.User?.first_name} {booking.User?.last_name}
                  </td>
                  <td className="py-2 px-4">
                    {booking.Seat?.seat_type || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {booking.Seat?.Flight?.flight_number || "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {formatDateTime(booking.createdAt)}
                  </td>
                  <td className="py-2 px-4">{booking.total_price}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-4 py-1 rounded-lg font-medium text-xs tracking-wide ${
                        booking.status === "paid"
                          ? "text-yellow-800 bg-yellow-100"
                          : booking.status === "booked"
                          ? "text-green-800 bg-green-100"
                          : booking.status === "canceled"
                          ? "text-red-800 bg-red-100"
                          : "text-gray-800 bg-gray-100"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings available</p>
        )}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:hidden">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
            >
              <div className="space-y-1">
                <p>
                  <strong>Booking ID:</strong> {booking.booking_id}
                </p>
                <p>
                  <strong>User ID:</strong> {booking.user_id}
                </p>
                <p>
                  <strong>User Name:</strong> {booking.User?.first_name}{" "}
                  {booking.User?.last_name}
                </p>
                <p>
                  <strong>Seat Type:</strong> {booking.Seat?.seat_type || "N/A"}
                </p>
                <p>
                  <strong>Flight Number:</strong>{" "}
                  {booking.Seat?.Flight?.flight_number || "N/A"}
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {formatDateTime(booking.createdAt)}
                </p>
                <p>
                  <strong>Total Price:</strong> {booking.total_price}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-4 py-1 rounded-lg font-medium text-sm tracking-wide ${
                      booking.status === "paid"
                        ? "text-yellow-800 bg-yellow-100"
                        : booking.status === "booked"
                        ? "text-green-800 bg-green-100"
                        : booking.status === "canceled"
                        ? "text-red-800 bg-red-100"
                        : "text-gray-800 bg-gray-100"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
          >
            &lt;
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuanLyDatVe;
