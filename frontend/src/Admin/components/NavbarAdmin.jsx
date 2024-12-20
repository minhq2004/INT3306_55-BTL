import { useState } from "react";
import { Link } from "react-router-dom";

const admin = localStorage.getItem("admin");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out of your session?"
    );

    if (confirmLogout) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      toast.success("Logout successfully!");
    }
  };

  return (
    <div className="bg-neutral-100 p-4 shadow-md">
      <div className="flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <div className="flex items-center gap-3">
          <p className="text-sm">Admin: {JSON.parse(admin)?.name}</p>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md bg-sky-500 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM11 13V19H13V13H11Z"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white shadow-lg p-4 space-y-2 text-right z-10">
          <Link
            onClick={handleMenuItemClick}
            to="/admin/thongtin"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Post
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/chuyenbay"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Flight
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/datve"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Booking
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/taubay"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Airplane
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/taikhoan"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Account
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/dichvu"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Service
          </Link>
          <Link
            onClick={handleMenuItemClick}
            to="/admin/khuyenmai"
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Promotion
          </Link>
          <Link
            to="/"
            onClick={(e) => {
              if (!handleLogout()) {
                e.preventDefault(); // Cancel navigation
              }
            }}
            className="block text-gray-700 hover:text-sky-500 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-300"
          >
            Log out
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
