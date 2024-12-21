import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";

const adminToken = localStorage.getItem("adminToken");

const QuanLyTauBay = () => {
  // State quản lý tàu bay
  const [airplanes, setAirplanes] = useState([]);

  // State quản lý lỗi và tải
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý chọn tàu bay
  const [selectedAirplane, setSelectedAirplane] = useState(null);

  // State quản lý bảng cập nhật
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State quản lý form sửa tàu bay
  const [formData, setFormData] = useState({});

  // State quản lý tàu bay mới thêm
  const [newAirplane, setNewAirplane] = useState({
    model: "",
    manufacturer: "",
    total_seats: "",
  });

  // Quản lý các state phân trang
  const [totalAirplanes, setTotalAirplanes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm fetch dữ liệu server
  const fetchAirplanes = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/airplanes/page/${page}`
      );

      const { airplanes, totalAirplanes, totalPages } = response.data;
      setAirplanes(airplanes);
      setTotalAirplanes(totalAirplanes);
      setTotalPages(totalPages || 1);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching airplanes:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirplanes(currentPage);
  }, [currentPage]);

  // Xử lý phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAirplanes(newPage);
    }
  };

  // Hàm thêm tàu bay
  const handleAddAirplane = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/airplanes",
        newAirplane,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setAirplanes((prev) => [...prev, response.data]);
      setNewAirplane({ model: "", manufacturer: "", total_seats: "" });

      fetchAirplanes(currentPage);
      toast.success("Airplane added successfully!");
    } catch (err) {
      console.error("Error adding airplane:", err.message);
      toast.error("Failed to add airplane. Please try again.");
    }
  };

  // Mở và đóng bảng modal
  const openModal = (airplane) => {
    setSelectedAirplane(airplane);
    setFormData({
      model: airplane.model,
      manufacturer: airplane.manufacturer,
      total_seats: airplane.total_seats,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAirplane(null);
    setFormData({});
    setError("");
  };

  // Hàm xử lý thay đổi các ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm cập nhật tàu bay
  const updateAirplane = async () => {
    if (!selectedAirplane) return;
    try {
      const updatedData = { ...formData };

      await axios.put(
        `http://localhost:3000/api/admin/airplanes/${selectedAirplane.airplane_id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setAirplanes((prev) =>
        prev.map((airplane) =>
          airplane.airplane_id === selectedAirplane.airplane_id
            ? { ...airplane, ...updatedData }
            : airplane
        )
      );
      toast.success("Airplane updated successfully!");
      fetchAirplanes(currentPage);
      closeModal();
    } catch (err) {
      console.error("Error updating airplane:", err.message);
      toast.error("Failed to update airplane. Please try again.");
    }
  };

  // Hàm xóa tàu bay
  const deleteAirplane = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/airplanes/${selectedAirplane.airplane_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setAirplanes((prev) =>
        prev.filter(
          (airplane) => airplane.airplane_id !== selectedAirplane.airplane_id
        )
      );
      toast.success("Airplane deleted successfully!");
      closeModal();
    } catch (err) {
      console.error("Error deleting airplane:", err.message);
      toast.error("Failed to delete airplane. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-4">
      <div className="rounded-lg bg-white flex flex-col overflow-auto shadow-md min-h-fit">
        <h1 className="font-bold text-xl mt-2 ml-4">Enter airplane data</h1>
        <div className="p-4 w-full sm:flex items-end gap-6">
          <div className="flex-1">
            <label className="text-gray-500">Model:</label>
            <input
              type="text"
              value={newAirplane.model}
              onChange={(e) =>
                setNewAirplane({ ...newAirplane, model: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className=" text-gray-500">Manufacturer</label>
            <input
              type="text"
              value={newAirplane.manufacturer}
              onChange={(e) =>
                setNewAirplane({ ...newAirplane, manufacturer: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className=" text-gray-500">Total seats</label>
            <input
              type="text"
              value={newAirplane.total_seats}
              onChange={(e) =>
                setNewAirplane({ ...newAirplane, total_seats: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="flex-1">
            <label className=" text-gray-500 hidden"></label>
            <button
              onClick={handleAddAirplane}
              className="mt-4 p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300 shadow-sm hover:shadow-lg w-full h-fit"
            >
              Add airplane
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl flex-col overflow-y-auto h-full space-y-4 shadow-md">
        <div className="block sm:flex items-end">
          <h3 className="font-bold text-2xl mt-2 ml-2">Airplane List</h3>
          <h2 className="font-bold text-xl mt-2 ml-2 sm:ml-auto">
            Total airplanes: {totalAirplanes}
          </h2>
        </div>
        <table className="hidden sm:table min-w-full border overflow-hidden border-gray-200 mt-4 table-auto border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
          <thead>
            <tr className="bg-gray-200 text-xs">
              <th className="py-2 px-4 rounded-l-[20px] w-2 text-nowrap">ID</th>
              <th className="py-2 px-4">Model</th>
              <th className="py-2 px-4">Manufacturer</th>
              <th className="py-2 px-4">Total seats</th>
              <th className="py-2 px-4 rounded-r-[20px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {airplanes.map((airplane) => (
              <tr key={airplane.id} className="even:bg-gray-100 text-sm">
                <td className="py-2 px-4">{airplane.airplane_id}</td>
                <td className="py-2 px-4">{airplane.model}</td>
                <td className="py-2 px-4">{airplane.manufacturer}</td>
                <td className="py-2 px-4">{airplane.total_seats}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => openModal(airplane)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:hidden">
          {airplanes.map((airplane) => (
            <div
              key={airplane.airplane_id}
              className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
            >
              <div className="flex-1 space-y-1">
                <p>
                  <strong>ID:</strong> {airplane.airplane_id}
                </p>
                <p>
                  <strong>Model:</strong> {airplane.model}
                </p>
                <p>
                  <strong>Manufactuter:</strong> {airplane.manufacturer}
                </p>
                <p>
                  <strong>Total seats:</strong> {airplane.total_seats}
                </p>
                <div className="ml-auto">
                  <button
                    className="flex items-center gap-2 duration-300 bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() => openModal(airplane)}
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
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10 shadow-lg">
            <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg shadow-lg border">
              <h2 className="text-xl font-bold mb-4 text-center">
                Update Airplane
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">Model:</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model || ""}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Manufacturer:</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer || ""}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Total Seats:</label>
                  <input
                    type="text"
                    name="total_seats"
                    value={formData.total_seats || ""}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-6 space-y-3 sm:space-y-0 sm:gap-2">
                {/* Remove Button */}
                <button
                  onClick={deleteAirplane}
                  className="flex items-center justify-center w-full sm:w-auto space-x-2 px-4 py-2 bg-rose-100 text-rose-900 rounded hover:bg-rose-200 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                  </svg>
                  <span>Remove airplane</span>
                </button>

                {/* Cancel Button */}
                <button
                  onClick={closeModal}
                  className="w-full ml-auto sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                {/* Update Button */}
                <button
                  onClick={updateAirplane}
                  className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
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

export default QuanLyTauBay;
