import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const adminToken = localStorage.getItem("adminToken");

const QuanLyDichVu = () => {
  // State quản lts dịch vụ
  const [services, setServices] = useState([]);

  // State quản lý lỗi và tải
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State quản lý modal chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho form thêm/cập nhật dịch vụ
  const [newService, setNewService] = useState({
    service_name: "",
    service_price: "",
  });
  const [formData, setFormData] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/public/services",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Tạo mới dịch vụ
  const createService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/services",
        newService,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setServices((prev) => [...prev, response.data]);
      setNewService({ service_name: "", service_price: "" });
      toast.success("Service added successfully!");
      fetchServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (service) => {
    setSelectedService(service);
    setFormData({
      service_name: service.service_name,
      service_price: service.service_price,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({});
    setError("");
  };

  // Cập nhật dịch vụ
  const updateService = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      return;
    }
    const updatedData = { ...formData };
    try {
      await axios.put(
        `http://localhost:3000/api/admin/services/${selectedService.service_id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setServices((prev) =>
        prev.map((service) =>
          service.service_id === selectedService.service_id
            ? { ...service, ...updatedData }
            : service
        )
      );
      toast.success("Updated successfully!");

      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Xóa dịch vụ
  const deleteService = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/services/${selectedService.service_id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setServices((prev) =>
        prev.filter(
          (service) => service.service_id !== selectedService.service_id
        )
      );
      toast.success("Service deleted successfully!");
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-xl h-[670px] flex flex-col space-y-4">
      <div className="rounded-lg bg-white flex flex-col overflow-auto shadow-md min-h-fit">
        <h1 className="font-bold text-xl mt-2 ml-4">Add service</h1>
        <div className="p-4 flex w-full space-x-6 items-end">
          <div className="flex-1">
            <label className="text-gray-500">Service name:</label>
            <input
              type="text"
              value={newService.service_name}
              onChange={(e) =>
                setNewService({ ...newService, service_name: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-500">Service price:</label>
            <input
              type="text"
              value={newService.service_price}
              onChange={(e) =>
                setNewService({ ...newService, service_price: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className=" text-gray-500 hidden"></label>
            <button
              onClick={createService}
              className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300 shadow-sm hover:shadow-lg w-full h-auto "
            >
              Add service
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl flex-col overflow-y-auto h-full space-y-4 shadow-md">
        <h3 className="font-bold text-xl mt-2">Service List</h3>
        <div className="flex-col w-full space-x-6 mt-4">
          <table className="min-w-full border overflow-hidden border-gray-200 mt-4 table-auto border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <thead>
              <tr className="bg-gray-200 text-xs">
                <th className="py-2 px-4 rounded-l-[20px] w-2 text-nowrap">
                  ID
                </th>
                <th className="py-2 px-4">Service name</th>
                <th className="py-2 px-4">Service price</th>
                <th className="py-2 px-4 rounded-r-[20px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr
                    key={service.service_id}
                    className="even:bg-gray-100 text-sm"
                  >
                    <td className="py-2 px-4">{service.service_id}</td>
                    <td className="py-2 px-4">{service.service_name}</td>
                    <td className="py-2 px-4">{service.service_price} VND</td>
                    <td className="py-2 px-4">
                      <button
                        className="rounded text-sm"
                        onClick={() => openModal(service)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10 shadow-lg">
            <div className="bg-white rounded-lg p-6 w-3/4 md:w-2/5 shadow-lg border">
              <h2 className="text-xl font-bold mb-4">Update service</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-600">Service name:</label>
                  <input
                    type="text"
                    name="service_name"
                    value={formData.service_name || ""}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Service price:</label>
                  <input
                    type="text"
                    name="service_price"
                    value={formData.service_price || ""}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-6 space-y-3 lg:space-y-0 lg:gap-2">
                {/* Remove Button */}
                <button
                  onClick={deleteService}
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
                  <span>Remove service</span>
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
                  onClick={updateService}
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

export default QuanLyDichVu;
