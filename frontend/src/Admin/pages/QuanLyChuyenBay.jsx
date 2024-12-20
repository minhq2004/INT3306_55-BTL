import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LocationInput from "../components/LocationInput";
import AirplaneInput from "../components/AirplaneInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS mặc định
import "../customize/custom-datepicker.css";

const adminToken = localStorage.getItem("adminToken");

// Hàm format ngày giờ sang định dạng dd/mm/yyyy, hh:mm phù hợp với định đạng của SQL
const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Cấu hình các miền trong bảng
const fieldConfig = {
  flight_number: { label: "Flight number", type: "text" },
  departure: { label: "Departure", type: "location" },
  destination: { label: "Destination", type: "location" },
  departure_date: { label: "Departure date", type: "date" },
  departure_time: { label: "Departure time", type: "time" },
  arrival_date: { label: "Arrival date", type: "date" },
  arrival_time: { label: "Arrival time", type: "time" },
  status: {
    label: "Status",
    type: "select",
    options: ["scheduled", "completed", "canceled", "delayed"],
  },
};

const QuanLyChuyenBay = () => {
  // State quản lý danh sách chuyến bay
  const [flights, setFlights] = useState([]);

  // State quản lý các trạng thái lỗi và tải
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý máy bay được chọn cho quá trình sửa xóa
  const [selectedFlight, setSelectedFlight] = useState(null);

  // State quản lý bảng chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State quản lý form chỉnh sửa
  const [formData, setFormData] = useState({});

  // State quản lý thống kế
  const [stats, setStats] = useState([]);

  // Các state quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFlights, setTotalFlights] = useState(0);

  // State quản lý form thêm chuyến bay mới
  const [newFlight, setNewFlight] = useState({
    flight_number: "",
    airplane_id: "",
    departure: "",
    destination: "",
    departure_date: "",
    departure_time: "",
    arrival_date: "",
    arrival_time: "",
    economy_price: "",
    business_price: "",
    first_class_price: "",
    status: "",
  });

  // Xử lý thêm chuyến bay mới
  const handleAddFlight = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newFlight),
      });

      setLoading(false);

      const data = await response.json();

      if (response.ok) {
        // Reset form sau khi thêm chuyến bay thành công
        setNewFlight({
          flight_number: "",
          airplane_id: "",
          departure: "",
          destination: "",
          departure_time: "",
          arrival_time: "",
          economy_price: "",
          business_price: "",
          first_class_price: "",
        });

        console.log("Flight created successfully:", data);
        toast.success("Flight created successfully!");

        // Fetch lại danh sách chuyến bay
        fetchFlights(currentPage);
        fetchStatistics();
      } else {
        console.error("Error creating flight:", data);
        setError(error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch thống kê chuyến bay
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/flights/stats",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching flight statistics:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu chuyến bay theo phân trang
  const fetchFlights = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/flights/page/${page}`
      );

      const { total_pages, total_flights, data } = response.data;
      setFlights(Array.isArray(data) ? data : [data]);
      setTotalFlights(total_flights);
      setTotalPages(total_pages || 1);
      setCurrentPage(page);

      console.log(flights);
    } catch (error) {
      console.error("Error fetching flights:", error.message);
      setError(error);
    }
  };

  useEffect(() => {
    fetchFlights(currentPage);
    fetchStatistics();
  }, [currentPage]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchFlights(newPage);
    }
  };

  // Mở modal và tự điền dữ liệu hiện tại của chuyến bay đó
  const openModal = (flight) => {
    setSelectedFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      departure: flight.departure,
      destination: flight.destination,
      departure_date: flight.departure_date,
      departure_time: flight.departure_time,
      arrival_date: flight.arrival_date,
      arrival_time: flight.arrival_time,
      status: flight.status,
    });
    setIsModalOpen(true);
  };

  // Đóng modal và clear dữ liệu
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
    setFormData({});
    setError("");
  };

  // Xử lý thay đổi dữ liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (key, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: date,
    }));
  };

  // Cập nhật chuyến bay
  const updateFlight = async () => {
    if (!selectedFlight) return;

    try {
      // Chuyển đổi định dạng datetime
      const updatedFormData = {
        ...formData,
      };

      await axios.put(
        `http://localhost:3000/api/admin/flights/${selectedFlight.flight_id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setFlights((prev) =>
        prev.map((f) =>
          f.flight_id === selectedFlight.flight_id
            ? { ...f, ...updatedFormData }
            : f
        )
      );

      // Fetch lại sau khi update tránh tải lại
      fetchStatistics();
      fetchFlights(currentPage);
      toast.success("Flight updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error updating flight:", err.message);
      setError("Failed to update flight. Please check the input data.");
    }
  };

  // Xóa chuyến bay
  const handleDeleteFlight = async () => {
    if (!selectedFlight) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/admin/flights/${selectedFlight.flight_id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      // Cập nhật danh sách chuyến bay
      setFlights((prev) =>
        prev.filter((flight) => flight.flight_id !== selectedFlight.flight_id)
      );

      // Fetch lại dữ liệu sau khi xóa
      fetchStatistics();
      fetchFlights(currentPage);
      toast.success("Flight deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error deleting flight:", error.message);
      toast.error("Failed to delete flight. Please try again.");
    }
  };

  // Hiển thị lỗi và tải nếu có
  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-3">
      <div className="block md:flex space-x-0 md:space-x-2 space-y-3 md:space-y-0 h-3/4 overflow-auto">
        <div className="rounded-lg bg-white flex flex-col md:overflow-auto shadow-md md:h-full flex-1">
          <h1 className="font-bold text-xl mt-2 ml-3">Enter flight data</h1>
          <div className="p-3 inline-flex w-full space-x-6">
            <div className="flex-1">
              <label className="text-gray-500">Flight number:</label>
              <input
                type="text"
                value={newFlight.flight_number}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, flight_number: e.target.value })
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500">Airplane id:</label>
              <AirplaneInput
                value={newFlight.airplane_id}
                onChange={(value) =>
                  setNewFlight({ ...newFlight, airplane_id: value })
                }
              />
            </div>
          </div>
          <div className="p-3 inline-flex w-full space-x-6">
            <div className="flex-1">
              <label className="block text-gray-500">Departure:</label>
              <LocationInput
                value={newFlight.departure}
                onChange={(value) =>
                  setNewFlight({ ...newFlight, departure: value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500">Destination:</label>
              <LocationInput
                value={newFlight.destination}
                onChange={(value) =>
                  setNewFlight({ ...newFlight, destination: value })
                }
              />
            </div>
          </div>
          <div className="p-3 inline-flex w-full space-x-6">
            <div className="flex-1">
              <label className="block text-gray-500">Departure date:</label>
              <div className="flex items-center border rounded mt-1 overflow-visible">
                <DatePicker
                  selected={newFlight.departure_date}
                  onChange={(date) =>
                    setNewFlight({ ...newFlight, departure_date: date })
                  }
                  className="w-full p-2 outline-none"
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-end"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="fill-black ml-10 lg:ml-7 flex-shrink-0"
                  width="20"
                  height="20"
                >
                  <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-500">Departure time:</label>
              <input
                type="time"
                value={newFlight.departure_time}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, departure_time: e.target.value })
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="p-3 inline-flex w-full space-x-6">
            <div className="flex-1">
              <label className="block text-gray-500">Arrival date:</label>
              <div className="flex items-center border rounded w-full mt-1 re">
                <DatePicker
                  selected={newFlight.arrival_date}
                  onChange={(date) =>
                    setNewFlight({ ...newFlight, arrival_date: date })
                  }
                  className="w-full p-2 outline-none z-50"
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-end"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="fill-black ml-10 lg:ml-7 flex-shrink-0"
                  width="20"
                  height="20"
                >
                  <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-500">Arrival time:</label>
              <input
                type="time"
                value={newFlight.arrival_time}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, arrival_time: e.target.value })
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="p-3 inline-flex w-full space-x-6">
            <div className="flex-1">
              <label className="block text-gray-500">Economy price:</label>
              <input
                type="number"
                value={newFlight.economy_price}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, economy_price: e.target.value })
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500">Business price:</label>
              <input
                type="number"
                value={newFlight.business_price}
                onChange={(e) =>
                  setNewFlight({ ...newFlight, business_price: e.target.value })
                }
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <div className="p-3 inline-flex w-full space-x-6 bottom-16">
            <div className="flex-1">
              <label className="block text-gray-500">First-class price:</label>
              <input
                type="number"
                value={newFlight.first_class_price}
                onChange={(e) =>
                  setNewFlight({
                    ...newFlight,
                    first_class_price: e.target.value,
                  })
                }
                className="mt-1 p-2 border rounded w-full h-10"
              />
            </div>
            <div className="flex-1">
              <button
                onClick={handleAddFlight}
                className="p-2 w-full mt-7 h-10 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300"
              >
                Add flight
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white flex flex-col shadow-md md:overflow-auto md:h-full flex-1 overflow-auto">
          <div className="p-4 xl:m-auto">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-1 xl:col-span-4 flex">
                <h3 className="text-2xl font-bold">
                  Total flights: {stats.total_flights}
                </h3>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-md font-semibold text-wrap truncate">
                  Completed flights: {stats.completed_flights}
                </h3>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-md font-semibold text-wrap truncate">
                  Delayed flights: {stats.delayed_flights}
                </h3>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-md font-semibold text-wrap truncate">
                  Canceled flights: {stats.canceled_flights}
                </h3>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-md font-semibold text-wrap truncate">
                  Scheduled flights: {stats.scheduled_flights}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-2 rounded-xl flex-col overflow-y-auto h-full space-y-4 shadow-md">
        <h3 className="font-bold text-2xl mt-2 ml-2">Flight list</h3>
        <>
          <table className="hidden min-[1378px]:table border min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px] table-fixed overflow-hidden border-gray-200 mt-4 border-collapse rounded-lg text-center">
            <thead>
              <tr className="bg-gray-200 text-xs">
                <th className="py-2 px-4 rounded-l-[20px]">Flight number</th>
                <th className="py-2 px-4">Airplane</th>
                <th className="py-2 px-4">Departure</th>
                <th className="py-2 px-4">Destination</th>
                <th className="py-2 px-4">Departure time</th>
                <th className="py-2 px-4">Arrival time</th>
                <th className="py-2 px-4">Economy price</th>
                <th className="py-2 px-4">Business price</th>
                <th className="py-2 px-4">First-class price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4 rounded-r-[20px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flight_id} className="even:bg-gray-100 text-sm">
                  <td className="py-2 px-4">{flight.flight_number}</td>
                  <td className="py-2 px-4">{flight.model}</td>
                  <td className="py-2 px-4">{flight.departure}</td>
                  <td className="py-2 px-4">{flight.destination}</td>
                  <td className="py-2 px-4">
                    {formatDateTime(
                      `${flight.departure_date}T${flight.departure_time}`
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {formatDateTime(
                      `${flight.arrival_date}T${flight.arrival_time}`
                    )}
                  </td>
                  <td className="py-2 px-4">{flight.economy_price}</td>
                  <td className="py-2 px-4">{flight.business_price}</td>
                  <td className="py-2 px-4">{flight.first_class_price}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        flight.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : flight.status === "delayed"
                          ? "bg-yellow-100 text-yellow-800"
                          : flight.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openModal(flight)}
                      className="rounded text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 min-[1378px]:hidden gap-6">
            {flights.map((flight) => (
              <div
                key={flight.flight_id}
                className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
              >
                <div className="flex-1 space-y-1">
                  <p>
                    <strong>Flight number:</strong> {flight.flight_number}
                  </p>
                  <p>
                    <strong>Airplane:</strong> {flight.model}
                  </p>
                  <p>
                    <strong>Departure:</strong> {flight.departure}
                  </p>
                  <p>
                    <strong>Destination:</strong> {flight.destination}
                  </p>
                  <p>
                    <strong>Departure time:</strong>{" "}
                    {formatDateTime(
                      `${flight.departure_date}T${flight.departure_time}`
                    )}
                  </p>
                  <p>
                    <strong>Arrival time:</strong>{" "}
                    {formatDateTime(
                      `${flight.arrival_date}T${flight.arrival_time}`
                    )}
                  </p>
                  <p>
                    <strong>Economy price:</strong> {flight.economy_price}
                  </p>
                  <p>
                    <strong>Business price:</strong> {flight.business_price}
                  </p>
                  <p>
                    <strong>First-class price:</strong>{" "}
                    {flight.first_class_price}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                        flight.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : flight.status === "delayed"
                          ? "bg-yellow-100 text-yellow-800"
                          : flight.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </p>
                  <div className="ml-auto">
                    <button
                      className="flex items-center gap-2 duration-300 bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300"
                      onClick={() => openModal(flight)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                      </svg>
                      Edit
                    </button>
                  </div>
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
        </>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center shadow-lg z-10">
            <div className="bg-white p-6 rounded shadow-lg w-3/4 md:w-2/5 h-[640px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Update Flight</h2>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form>
                {Object.entries(fieldConfig).map(([key, config]) => (
                  <div key={key} className="mb-4 lg:flex items-center block">
                    <label className="w-full">{config.label}</label>
                    {config.type === "select" ? (
                      <select
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded w-full"
                      >
                        <option value="" disabled>
                          Select status
                        </option>
                        {config.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : config.type === "location" ? (
                      <LocationInput
                        value={formData[key]}
                        onChange={(value) => handleLocationChange(key, value)} // Sử dụng hàm này để cập nhật giá trị location
                      />
                    ) : config.type === "date" ? (
                      <div className="w-full relative">
                        <div className="flex items-center border rounded w-full mt-1 mr-2">
                          <DatePicker
                            selected={formData[key]}
                            onChange={(date) => handleDateChange(key, date)}
                            className="w-72 sm:w-96 lg:w-full p-2 z-50 outline-none" // Đảm bảo DatePicker co giãn
                            dateFormat="dd/MM/yyyy"
                            popperPlacement="bottom-end"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="fill-black absolute right-3 lg:ml-10 flex-shrink-0"
                            width="20"
                            height="20"
                          >
                            <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={config.type}
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded w-full"
                      />
                    )}
                  </div>
                ))}
              </form>
              <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-6 space-y-3 lg:space-y-0 lg:gap-2">
                {/* Remove Button */}
                <button
                  onClick={handleDeleteFlight}
                  className="block lg:flex items-center justify-center w-full lg:w-auto space-x-2 px-4 py-2 bg-rose-100 text-rose-900 rounded hover:bg-rose-200 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 m-auto"
                  >
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                  </svg>
                  <span>Remove flight</span>
                </button>

                {/* Cancel Button */}
                <button
                  onClick={closeModal}
                  className="w-full ml-auto lg:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                {/* Update Button */}
                <button
                  onClick={updateFlight}
                  className="w-full lg:w-auto px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuanLyChuyenBay;
