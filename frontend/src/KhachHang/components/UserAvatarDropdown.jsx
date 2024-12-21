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
import { useNavigate } from "react-router-dom";

const UserAvatarDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    const handleClick = (e) => {
      if (onClick) {
        onClick();
        return;
      }

      e.preventDefault();
      setIsDropdownOpen(false);
      navigate(to);
    };

    const content = (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
          <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
        </div>
        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
          {text}
        </span>
      </div>
    );

    if (onClick) {
      return (
        <button
          onClick={handleClick}
          className={`w-full group flex items-center px-3 md:px-4 py-2.5 md:py-3 hover:bg-gray-50
            transition-all duration-200 ${className}`}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={`group flex items-center px-3 md:px-4 py-2.5 md:py-3 hover:bg-gray-50
          transition-all duration-200 ${className}`}
      >
        {content}
      </Link>
    );
  };

  if (!user) return null;

  const userLevel = user.role === "admin" ? "Admin" : "Thành viên chính thức";

  const MenuContent = () => (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Profile Header */}
      <div className="relative p-4 md:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 md:w-24 h-20 md:h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* User Info */}
        <div className="relative flex items-center gap-3 md:gap-4">
          <div className="relative">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-white flex items-center justify-center text-lg md:text-xl font-bold text-blue-600 shadow-lg">
              {getAvatarInitial()}
            </div>
            {user.role === "admin" && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 rounded-lg bg-yellow-400 flex items-center justify-center shadow-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base md:text-lg truncate">
              {user.first_name || user.name || "User"}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
              <span className="text-xs md:text-sm text-white/90 truncate">
                {userLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <MenuItem icon={UserIcon} text="Hồ sơ cá nhân" to="/userprofile" />
        <MenuItem icon={Ticket} text="Lịch sử đặt vé" to="/userbooking" />
        <div className="my-1.5 md:my-2 border-t border-gray-100" />
        <MenuItem
          icon={LogOut}
          text="Đăng xuất"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700"
        />
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop View with Dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-xl transition-all duration-200 group
            ${
              isScrolled
                ? "bg-blue-50 hover:bg-blue-100/80 border border-blue-200"
                : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
            }
          `}
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className={`
                w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm md:text-base
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
                absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2
                ${
                  isScrolled
                    ? "bg-green-500 border-white"
                    : "bg-green-400 border-white"
                }
              `}
            />
          </div>

          {/* User Info - Only on larger screens */}
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
              {user.role === "admin" ? "System Admin" : "Thành viên"}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200
              ${isDropdownOpen ? "rotate-180" : ""}
              ${isScrolled ? "text-blue-600" : "text-white/80"}
            `}
          />
        </button>

        {/* Desktop Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 z-50 animate-fade-in-up transform-gpu">
            <MenuContent />
          </div>
        )}
      </div>

      {/* Mobile View - Always Visible Menu */}
      <div className="md:hidden w-full">
        <MenuContent />
      </div>
    </div>
  );
};

export default UserAvatarDropdown;
