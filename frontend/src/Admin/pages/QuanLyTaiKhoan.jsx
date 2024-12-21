import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";

const adminToken = localStorage.getItem("adminToken");

// Hàm format ngày giờ sang định dạng dd/mm/yyyy, hh:mm phù hợp với định đạng của SQL
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const QuanLyTaiKhoan = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // Các state quản lý phân trang admin
  const [currentAdminPage, setCurrentAdminPage] = useState(1);
  const [totalAdminPages, setTotalAdminPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);

  // Các state quản lý phân trang user
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [updateAdminData, setUpdateAdminData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  // State quản lý các trạng thái lỗi và tải
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu admin từ server
  const fetchAdmins = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/admins/page/${page}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setAdmins(response.data.admins);
      setTotalAdminPages(response.data.totalPages || 1);
      setTotalAdmins(response.data.totalAdmins);
      setCurrentAdminPage(page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
      setError(error.message);
    }
  };

  // Hàm fetch dữ liệu user từ server
  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/users/page/${page}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setUsers(response.data.users);
      setTotalUserPages(response.data.totalPages || 1);
      setTotalUsers(response.data.totalUsers);
      setCurrentUserPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    }
  };

  // Hàm tạo admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/admin/register/admins",
        newAdmin,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      toast.success("Admin has been created successfully!");
      setNewAdmin({ name: "", email: "", phone: "", password: "" });
      setIsCreateModalOpen(false);
      fetchAdmins();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating admin."
      );
      setError(error.message);
    }
  };

  // Hàm chỉnh sửa admin
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) {
      toast("No admin found to update.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/admin/admins/${selectedAdmin.admin_id}`,
        updateAdminData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      toast.success("Update successfully!");
      setIsUpdateModalOpen(false);
      setSelectedAdmin(null);
      fetchAdmins(currentAdminPage);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchAdmins(currentAdminPage);
    fetchUsers(currentUserPage);
  }, [currentAdminPage, currentUserPage]);

  // Hàm xử lý chuyển trang
  const handleAdminPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalAdminPages) {
      setCurrentAdminPage(currentAdminPage);
      fetchAdmins(newPage);
    }
  };

  const handleUserPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalUserPages) {
      setCurrentUserPage(currentUserPage);
      fetchUsers(newPage);
    }
  };

  // Hiển thị lỗi và tải nếu có
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="rounded-xl h-screen min-h-screen flex flex-col space-y-4">
      {/* Danh sách Admin */}
      <div className="h-3/5 p-4 bg-white rounded-lg shadow-md overflow-auto">
        <div className="flex items-center">
          <h3 className="text-xl font-semibold mb-2">
            Admin List: {totalAdmins} {totalAdmins == 1 ? `admin` : `admins`}
          </h3>
          <button
            className="ml-auto text-xs border p-2 rounded-lg hover:bg-sky-500 hover:text-white duration-300 sm:text-sm sticky top-0"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Admin
          </button>
        </div>

        <div className="flex-col w-full space-x-6 mt-4">
          <div className="overflow-auto">
            <table className="hidden lg:table w-full p-4 table-fixed border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <thead>
                <tr className="bg-gray-200 text-xs">
                  <th className="py-2 px-4 rounded-l-[20px] w-2">ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone number</th>
                  <th className="py-2 px-4 rounded-r-[20px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr
                      key={admin.admin_id}
                      className="text-sm even:bg-gray-100"
                    >
                      <td className="py-2 px-4">{admin.admin_id}</td>
                      <td className="py-2 px-4">{admin.name}</td>
                      <td className="py-2 px-4">{admin.email}</td>
                      <td className="py-2 px-4">{admin.phone || "N/A"}</td>
                      <td className="py-2 px-4">
                        <button
                          className="rounded text-sm"
                          onClick={() => {
                            const loggedInAdminId = JSON.parse(
                              atob(adminToken.split(".")[1])
                            ).admin_id;

                            if (loggedInAdminId !== admin.admin_id) {
                              toast.error(
                                "You only have the right to edit your own information!"
                              );
                              return;
                            }
                            setSelectedAdmin(admin);
                            setUpdateAdminData({
                              name: admin.name,
                              phone: admin.phone || "",
                              password: "",
                            });
                            setIsUpdateModalOpen(true);
                          }}
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
                    <td colSpan="5" className="p-4 text-center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:hidden">
            {admins.map((admin) => (
              <div
                key={admin.admin_id}
                className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
              >
                <div className="flex-1 space-y-1">
                  <p>
                    <strong>ID:</strong> {admin.admin_id}
                  </p>
                  <p>
                    <strong>Name:</strong> {admin.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {admin.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {admin.phone || "N/A"}
                  </p>
                  <div className="ml-auto">
                    <button
                      className="flex items-center gap-2 duration-300 bg-sky-500 text-white px-2 py-1 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300"
                      // Chỉ admin đăng nhập mới sửa được thông tin của họ không sửa của người khác
                      onClick={() => {
                        const loggedInAdminId = JSON.parse(
                          atob(adminToken.split(".")[1])
                        ).admin_id;

                        if (loggedInAdminId !== admin.admin_id) {
                          toast.error(
                            "You only have the right to edit your own information!"
                          );
                          return;
                        }
                        setSelectedAdmin(admin);
                        setUpdateAdminData({
                          name: admin.name,
                          phone: admin.phone || "",
                          password: "",
                        });
                        setIsUpdateModalOpen(true);
                      }}
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
              onClick={() => handleAdminPageChange(currentAdminPage - 1)}
              disabled={currentAdminPage === 1}
              className={`px-4 py-2 rounded-md border ${
                currentAdminPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              &lt;
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentAdminPage} / {totalAdminPages}
            </span>

            <button
              onClick={() => handleAdminPageChange(currentAdminPage + 1)}
              disabled={currentAdminPage === totalAdminPages}
              className={`px-4 py-2 rounded-md border ${
                currentAdminPage === totalAdminPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
        {/* Modal tạo Admin */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <>
              <div className="bg-white shadow-lg p-6 rounded-lg w-96">
                <div className="flex mb-6">
                  <h3 className="text-lg font-semibold">Add Admin</h3>
                  <button
                    className="ml-auto bg-red-300 rounded-full hover:bg-red-500 transition duration-150 w-6 h-6"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 fill-white m-auto mt-1  "
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.585l4.714 4.715a.75.75 0 11-1.06 1.06L12 11.645l-4.715 4.715a.75.75 0 11-1.06-1.06l4.714-4.715-4.714-4.714a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateAdmin}>
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Name"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                  />
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Phone number"
                    value={newAdmin.phone}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, phone: e.target.value })
                    }
                  />
                  <input
                    className="w-full mb-4 p-2 border rounded"
                    type="password"
                    placeholder="Password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 duration-100 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Add
                  </button>
                </form>
              </div>
            </>
          </div>
        )}
        {/* Modal cập nhật Admin */}
        {isUpdateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10 shadow-lg">
            <>
              <div className="bg-white p-6 shadow-lg  rounded-lg w-96">
                <div className="flex mb-6">
                  <h3 className="text-lg font-semibold">
                    Update admin information
                  </h3>
                  <button
                    className="ml-auto bg-red-300 rounded-full hover:bg-red-400 transition duration-150 w-6 h-6"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 fill-white m-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.585l4.714 4.715a.75.75 0 11-1.06 1.06L12 11.645l-4.715 4.715a.75.75 0 11-1.06-1.06l4.714-4.715-4.714-4.714a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleUpdateAdmin}>
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Name"
                    value={updateAdminData.name}
                    onChange={(e) =>
                      setUpdateAdminData({
                        ...updateAdminData,
                        name: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Phone number"
                    value={updateAdminData.phone}
                    onChange={(e) =>
                      setUpdateAdminData({
                        ...updateAdminData,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full mb-4 p-2 border rounded"
                    type="password"
                    placeholder="Password (if want to change)"
                    value={updateAdminData.password}
                    onChange={(e) =>
                      setUpdateAdminData({
                        ...updateAdminData,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 duration-100 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Update
                  </button>
                </form>
              </div>
            </>
          </div>
        )}
      </div>

      {/* Danh sách User */}
      <div className="bg-white p-4 rounded-xl overflow-y-auto h-full shadow-md ">
        <h3 className="text-xl font-semibold mb-2">
          User List: {totalUsers} {totalUsers == 1 ? `user` : `users`}
        </h3>
        <div className="overflow-auto">
          <table className="hidden lg:table w-full p-6 border-collapse rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center text-wrap">
            <thead>
              <tr className="bg-gray-200 text-xs">
                <th className="py-2 px-4 rounded-l-[20px] w-2">ID</th>
                <th className="py-2 px-4">Full Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone number</th>
                <th className="py-2 px-4">Passport</th>
                <th className="py-2 px-4">ID Card</th>
                <th className="py-2 px-4">Created at</th>
                <th className="py-2 px-4">Updated at</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id} className="text-sm even:bg-gray-100">
                    <td className="py-2 px-4 truncate">{user.user_id}</td>
                    <td className="py-2 px-4">
                      {`${user.first_name} ${user.last_name}`}
                    </td>
                    <td className="py-2 px-4 break-words">{user.email}</td>
                    <td className="py-2 px-4">{user.phone || "N/A"}</td>
                    <td className="py-2 px-4">{user.passport || "N/A"}</td>
                    <td className="py-2 px-4">{user.id_card || "N/A"}</td>
                    <td className="py-2 px-4">
                      {formatDateTime(user.createdAt) || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {formatDateTime(user.updatedAt) || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:hidden">
          {users.map((user) => (
            <div
              key={user.user_id}
              className="p-4 flex flex-col bg-gray-50 border border-gray-200 shadow space-y-4 rounded-lg hover:shadow-lg duration-300 min-h-fit"
            >
              <div className="flex-1 space-y-1">
                <p>
                  <strong>ID:</strong> {user.user_id}
                </p>
                <p>
                  <strong>First name:</strong> {user.first_name}
                </p>
                <p>
                  <strong>Last name:</strong> {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
                <p>
                  <strong>Passport:</strong> {user.passport || "N/A"}
                </p>
                <p>
                  <strong>ID card:</strong> {user.id_card || "N/A"}
                </p>
                <p>
                  <strong>Created at:</strong>{" "}
                  {formatDateTime(user.createdAt) || "N/A"}
                </p>
                <p>
                  <strong>Updated at:</strong>{" "}
                  {formatDateTime(user.updatedAt) || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={() => handleUserPageChange(currentUserPage - 1)}
            disabled={currentUserPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentUserPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-50 text-blue-600"
            }`}
          >
            &lt;
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentUserPage} / {totalUserPages}
          </span>

          <button
            onClick={() => handleUserPageChange(currentUserPage + 1)}
            disabled={currentUserPage === totalUserPages}
            className={`px-4 py-2 rounded-md border ${
              currentUserPage === totalUserPages
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

export default QuanLyTaiKhoan;
