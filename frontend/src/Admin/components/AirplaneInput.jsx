import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const AirplaneInput = ({ value, onChange }) => {
  // Các state quản lý component
  const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý máy bay
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Điều khiển hiển thị dropdown
  const [dropdownStyles, setDropdownStyles] = useState({}); // Style cho dropdown
  const inputRef = useRef(null); // Tham chiếu đến input
  const dropdownRef = useRef(null); // Tham chiếu đến dropdown

  // Lấy danh sách máy bay từ API
  const fetchAirplanes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/public/airplanes"
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching airplanes:", error);
    }
  };

  // Xử lý khi người dùng nhập liệu
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim()) {
      // Lọc gợi ý dựa trên ID máy bay hoặc model
      const filteredSuggestions = suggestions.filter(
        (airplane) =>
          airplane.airplane_id
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          airplane.model.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      fetchAirplanes(); // Hiển thị tất cả khi input rỗng
    }
    setDropdownVisible(true);
  };

  // Xử lý khi chọn một máy bay từ danh sách
  const handleSelectSuggestion = (airplaneId) => {
    onChange(airplaneId); // Cập nhật giá trị input
    setDropdownVisible(false); // Ẩn dropdown
  };

  // Tính toán vị trí hiển thị của dropdown
  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        minWidth: rect.width,
        maxWidth: "600px",
      };
    }
    return {};
  };

  // Xử lý khi input được focus
  const handleFocus = () => {
    fetchAirplanes(); // Lấy toàn bộ danh sách máy bay khi input được focus
    setDropdownVisible(true);
  };

  // Xử lý khi input mất focus
  const handleBlur = (e) => {
    // Đợi 200ms để xử lý event click bên trong dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => setDropdownVisible(false), 200);
  };

  // Cập nhật vị trí dropdown khi hiển thị
  useEffect(() => {
    if (isDropdownVisible) {
      const position = calculateDropdownPosition();
      setDropdownStyles({
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: `${position.minWidth}px`,
        maxWidth: position.maxWidth,
        zIndex: 50,
      });
    }
  }, [isDropdownVisible]);

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="mt-1 p-2 border rounded w-full"
      />

      {/* Dropdown */}
      {isDropdownVisible &&
        suggestions.length > 0 &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-auto"
          >
            <ul>
              {suggestions.map((airplane) => (
                <li
                  key={airplane.airplane_id}
                  onClick={() => handleSelectSuggestion(airplane.airplane_id)}
                  className="cursor-pointer p-2 hover:bg-blue-100 flex justify-between items-center"
                >
                  <span className="text-md">{airplane.model}</span>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AirplaneInput;
