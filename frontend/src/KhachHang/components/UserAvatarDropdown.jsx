import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon,
  LogOut,
  Ticket,
  ChevronDown,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const UserAvatarDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getAvatarInitial = () => {
    if (!user) return "";
    return (user.first_name || user.name || "U")[0].toUpperCase();
  };

  const MenuItem = ({ icon: Icon, text, to, onClick, className = "" }) => {
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={`w-full group flex items-center px-4 py-3 hover:bg-gray-50
            transition-all duration-200 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center
              group-hover:bg-white group-hover:shadow-sm transition-all duration-200"
            >
              <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
              {text}
            </span>
          </div>
        </button>
      );
    }

    return (
      <Link
        to={to}
        className={`group flex items-center px-4 py-3 hover:bg-gray-50
          transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center
            group-hover:bg-white group-hover:shadow-sm transition-all duration-200"
          >
            <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
          </div>
          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
            {text}
          </span>
        </div>
      </Link>
    );
  };

  if (!user) return null;

  const userLevel = user.role === "admin" ? "Admin" : "Thành viên chính thức";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`
          flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group
          ${
            isScrolled
              ? "bg-blue-50 hover:bg-blue-100/80 border border-blue-200"
              : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
          }
        `}
      >
        <div className="relative">
          <div
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              font-bold shadow-lg group-hover:scale-105 transition-all duration-200
              ${
                isScrolled
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                  : "bg-white text-blue-600"
              }
            `}
          >
            {getAvatarInitial()}
          </div>
          <div
            className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2
              ${
                isScrolled
                  ? "bg-green-500 border-white"
                  : "bg-green-400 border-white"
              }
            `}
          />
        </div>

        <div className="hidden lg:block text-left">
          <p
            className={`text-sm font-semibold line-clamp-1
              ${isScrolled ? "text-blue-900" : "text-white"}
            `}
          >
            {user.first_name || user.name || "User"}
          </p>
          <p
            className={`text-xs
              ${isScrolled ? "text-blue-600" : "text-white/80"}
            `}
          >
            {user.role === "admin" ? "System Admin" : "Member"}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200
            ${isDropdownOpen ? "rotate-180" : ""}
            ${isScrolled ? "text-blue-600" : "text-white/80"}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100
          overflow-hidden z-50 animate-fade-in-up"
        >
          {/* User Profile Header */}
          <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-xl bg-white flex items-center justify-center
                  text-blue-600 font-bold text-xl shadow-lg"
                >
                  {getAvatarInitial()}
                </div>
                {user.role === "admin" && (
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-yellow-400
                    flex items-center justify-center shadow-lg"
                  >
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-lg">
                  {user.first_name || user.name || "User"}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/90">{userLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <MenuItem icon={UserIcon} text="Hồ sơ cá nhân" to="/userprofile" />
            <MenuItem icon={Ticket} text="Lịch sử đặt vé" to="/userbooking" />
            <div className="my-2 border-t border-gray-100" />
            <MenuItem
              icon={LogOut}
              text="Đăng xuất"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;
