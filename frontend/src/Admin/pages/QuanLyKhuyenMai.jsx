import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";

const adminToken = localStorage.getItem("adminToken");

const QuanLyKhuyenMai = () => {
  // State quản lý mã giảm giá
  const [discounts, setDiscounts] = useState([]);

  // State quản lý lỗi và tải
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State quản lý modal chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho form thêm/cập nhật mã giảm giá
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    discount_percentage: "",
  });
  const [formData, setFormData] = useState({});
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Lấy danh sách mã giảm giá
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/discounts",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setDiscounts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Tạo mới mã giảm giá
  const createDiscount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/discounts",
        newDiscount,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setDiscounts((prev) => [...prev, response.data]);
      setNewDiscount({ code: "", discount_percentage: "" });
      toast.success("Discount created successfully!");
      fetchDiscounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      code: discount.code,
      discount_percentage: discount.discount_percentage,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDiscount(null);
    setFormData({});
    setError("");
  };

  // Cập nhật mã giảm giá
  const updateDiscount = async (e) => {
    e.preventDefault();
    if (!selectedDiscount) return;

    const updatedData = { ...formData };
    try {
      await axios.put(
        `http://localhost:3000/api/admin/discounts/${selectedDiscount.discount_id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.discount_id === selectedDiscount.discount_id
            ? { ...discount, ...updatedData }
            : discount
        )
      );
      toast.success("Discount updated successfully!");

      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Xóa mã giảm giá
  const deleteDiscount = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/discounts/${selectedDiscount.discount_id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setDiscounts((prev) =>
        prev.filter(
          (discount) => discount.discount_id !== selectedDiscount.discount_id
        )
      );
      toast.success("Discount deleted successfully!");
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Hiển thị lỗi và tải nếu có
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-4">
      {/* Form thêm mã giảm giá */}
      <div className="rounded-lg bg-white flex flex-col overflow-auto shadow-md min-h-fit">
        <h1 className="font-bold text-xl mt-2 ml-4">Add discount</h1>
        <div className="p-4 flex w-full space-x-6 items-end">
          <div className="flex-1">
            <label className="text-gray-500">Discount code:</label>
            <input
              type="text"
              value={newDiscount.code}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, code: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-500">Discount percentage:</label>
            <input
              type="number"
              value={newDiscount.discount_percentage}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  discount_percentage: e.target.value,
                })
              }
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex-1 items-end">
            <label className=" text-gray-500 hidden"></label>
            <button
              onClick={createDiscount}
              className="mt-1 p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300 shadow-sm hover:shadow-lg w-full h-auto"
            >
              Add discount
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách mã giảm giá */}
      <div className="bg-white p-4 rounded-xl flex-col overflow-y-auto h-full space-y-4 shadow-md">
        <h3 className="font-bold text-xl mt-2">Discount list</h3>
        <div className="flex-col w-full space-x-6 mt-4">
          <table className="min-w-full border overflow-hidden border-gray-200 mt-4 table-fixed border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
            <thead>
              <tr className="bg-gray-200 text-xs">
                <th className="py-2 px-4 rounded-l-[20px] w-2 text-nowrap ">
                  ID
                </th>
                <th className="py-2 px-4">Discount code</th>
                <th className="py-2 px-4">Discount percentage</th>
                <th className="py-2 px-4 rounded-r-[20px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length > 0 ? (
                discounts.map((discount) => (
                  <tr
                    key={discount.discount_id}
                    className="even:bg-gray-100 text-sm"
                  >
                    <td className="py-2 px-4">{discount.discount_id}</td>
                    <td className="py-2 px-4">{discount.code}</td>
                    <td className="py-2 px-4">
                      {discount.discount_percentage}%
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="rounded text-sm"
                        onClick={() => openModal(discount)}
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
                  <td colSpan="4" className="p-4 text-center">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10 shadow-lg">
          <div className="bg-white rounded-lg p-6 w-3/4 md:w-2/5 shadow-lg border">
            <h2 className="text-xl font-bold mb-4">Update discount</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600">Discount code:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code || ""}
                  onChange={handleInputChange}
                  className="block w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-gray-600">Discount percentage:</label>
                <input
                  type="text"
                  name="discount_percentage"
                  value={formData.discount_percentage || ""}
                  onChange={handleInputChange}
                  className="block w-full mt-1 p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-6 space-y-3 lg:space-y-0 lg:gap-2">
              {/* Remove Button */}
              <button
                onClick={deleteDiscount}
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
                <span>Remove discount</span>
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
                onClick={updateDiscount}
                className="w-full lg:w-auto px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyKhuyenMai;
