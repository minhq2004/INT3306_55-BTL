import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { User, PlaneTakeoff, PlaneLanding } from "lucide-react";
import PassengerSelector from "./PassengerSelector";
import useFlightStore from "../stores/useFlightStore.js";
import axios from "axios";
import DateInput from "./DateInput.jsx";
// LocationInput Component
const LocationInput = ({ value, onChange, placeholder, startContent }) => {
  const [suggestions, setSuggestions] = useState([]); // Danh sách gợi ý
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Hiển thị dropdown
  const [activeCountry, setActiveCountry] = useState(null); // Quốc gia đang được chọn
  const [dropdownStyles, setDropdownStyles] = useState({}); // Vị trí dropdown
  const inputRef = useRef(null); // Tham chiếu đến ô nhập liệu

  // Lấy toàn bộ danh sách địa điểm
  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/public/locations"
      );
      const data = response.data;
      setSuggestions(data); // Cập nhật danh sách gợi ý
      if (data.length > 0) {
        setActiveCountry(data[0]); // Chọn quốc gia đầu tiên
      }
    } catch (error) {
      console.error("Error fetching all locations:", error);
    }
  };

  // Lấy gợi ý dựa trên từ khóa
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/locations/${query}`
      );
      const data = response.data;
      setSuggestions(data);
      if (data.length > 0) {
        setActiveCountry(data[0]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Xử lý khi người dùng nhập liệu
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim()) {
      fetchSuggestions(inputValue); // Lấy gợi ý mới
    } else {
      fetchAllLocations(); // Hiển thị toàn bộ địa điểm
    }
    setDropdownVisible(true); // Hiển thị dropdown
  };

  // Chọn một gợi ý từ danh sách
  const handleSelectSuggestion = (city) => {
    onChange(city);
    setDropdownVisible(false);
  };

  // Hiển thị gợi ý khi focus vào ô nhập liệu
  const handleFocus = () => {
    if (!value.trim()) fetchAllLocations();
    setDropdownVisible(true);
  };

  // Cập nhật quốc gia được hover
  const handleMouseEnterCountry = (country) => {
    setActiveCountry(country);
  };

  // Tính toán vị trí hiển thị dropdown
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
    <div className="relative w-full h-full">
      <div className="h-full relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {startContent}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
          className="h-full w-full bg-transparent text-medium px-12 outline-none"
        />
      </div>

      {/* Hiển thị dropdown gợi ý */}
      {isDropdownVisible &&
        suggestions.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={dropdownStyles}
            className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl max-h-[400px] overflow-hidden animate-in fade-in duration-200"
          >
            <div className="flex divide-x divide-gray-100">
              {/* Danh sách quốc gia */}
              <div className="w-1/3 bg-gray-50/80 backdrop-blur-md">
                <div className="sticky top-0 bg-gray-50/90 backdrop-blur-md px-3 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600">
                    Các quốc gia
                  </h3>
                </div>
                <div className="max-h-[360px] overflow-auto">
                  {suggestions.map((group) => (
                    <div
                      key={group.country}
                      onMouseEnter={() => handleMouseEnterCountry(group)}
                      className={`
                  mx-2 my-1 px-3 py-2 rounded-lg cursor-pointer 
                  transition-all duration-200 ease-in-out
                  ${
                    activeCountry?.country === group.country
                      ? "bg-sky-500 text-white shadow-md"
                      : "hover:bg-sky-100 text-gray-700 hover:text-gray-900"
                  }
                `}
                    >
                      <div className="font-medium">{group.country}</div>
                      <div className="text-xs opacity-80">
                        {group.cities.length} cities
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danh sách thành phố */}
              <div className="w-2/3 bg-white">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600">
                    Các thành phố tại {activeCountry?.country}
                  </h3>
                </div>
                <div className="max-h-[360px] overflow-auto p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {activeCountry?.cities.map((city) => (
                      <div
                        key={city}
                        onClick={() => handleSelectSuggestion(city)}
                        className="
                    px-3 py-2 rounded-lg cursor-pointer
                    transition-all duration-200 ease-in-out
                    hover:bg-blue-50 text-gray-700 hover:text-gray-900
                    hover:shadow-sm
                  "
                      >
                        <div className="font-medium">{city}</div>
                        <div className="text-xs text-gray-500">
                          {activeCountry.country}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Styles chung cho các input

// OneWaySearch Component
const OneWaySearch = () => {
  const navigate = useNavigate(); // Điều hướng
  const { searchParams, setSearchParams, updatePassengers } = useFlightStore(); // Lấy và cập nhật tham số tìm kiếm

  // Hàm xử lý khi nhấn "Search"
  const handleSearch = () => {
    const { departure, destination, departureDate, passengers } = searchParams;

    if (!departure || !destination || !departureDate) {
      alert("Please fill in all required fields"); // Kiểm tra nhập liệu
      return;
    }

    const totalPassengers = passengers.adults + passengers.minors; // Tổng số hành khách
    navigate(
      `/flights/oneway/${departure}/${destination}/${departureDate}/${totalPassengers}` // Chuyển hướng tìm kiếm
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-0 bg-white/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
      {/* Stack vertically on mobile, row on desktop */}
      <div className="md:w-[23%] w-full border-b md:border-b-0 md:border-r border-gray-200/30 h-16 relative">
        <LocationInput
          value={searchParams.departure}
          onChange={(value) => setSearchParams({ departure: value })}
          placeholder="Nơi đi"
          startContent={<PlaneTakeoff className="text-gray-400" size={20} />}
        />
      </div>

      <div className="md:w-[23%] w-full border-b md:border-b-0 md:border-r border-gray-200/30 h-16 relative">
        <LocationInput
          value={searchParams.destination}
          onChange={(value) => setSearchParams({ destination: value })}
          placeholder="Nơi đến"
          startContent={<PlaneLanding className="text-gray-400" size={20} />}
        />
      </div>

      <div className="md:w-[16%] w-full border-b md:border-b-0 md:border-r border-gray-200/30 h-16">
        <DateInput
          value={searchParams.departureDate}
          onChange={(value) => setSearchParams({ departureDate: value })}
          placeholder="Ngày đi"
        />
      </div>

      <div className="md:w-[22%] w-full border-b md:border-b-0 md:border-r border-gray-200/30 h-16">
        <Popover placement="bottom">
          <PopoverTrigger className="h-full">
            <Input
              placeholder="Số hành khách"
              value={searchParams.passengersDisplay}
              readOnly
              startContent={<User className="text-gray-400" size={20} />}
              classNames={{
                base: "h-full",
                mainWrapper: "h-full",
                input: "text-medium bg-transparent cursor-pointer h-full",
                inputWrapper:
                  "h-full bg-transparent hover:bg-white/40 transition-colors cursor-pointer rounded-none",
              }}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PassengerSelector
              adultsCount={searchParams.passengers.adults}
              minorsCount={searchParams.passengers.minors}
              onUpdatePassengers={updatePassengers}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:w-[16%] w-full h-16">
        <Button
          className="w-full h-full bg-[#1a84dc] text-white rounded-none hover:bg-[#46e5c3] transition-colors"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default OneWaySearch;
