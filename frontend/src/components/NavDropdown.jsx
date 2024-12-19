import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Newspaper, TagIcon, Bell, Info } from "lucide-react";

const NavDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { id: "news", label: "Tin tức", icon: Newspaper },
    { id: "promotion", label: "Khuyến mãi", icon: TagIcon },
    { id: "announcement", label: "Thông báo", icon: Bell },
    { id: "about", label: "Về chúng tôi", icon: Info },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-[#fefeff] hover:text-[#5bdaeb] transition-all duration-200"
      >
        <span className="text-base">Khám phá</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
          {categories.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              to={`/posts/${id}`}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#5bdaeb] transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
