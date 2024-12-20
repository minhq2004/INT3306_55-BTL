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
  const [suggestions, setSuggestions] = useState([]); // Lưu danh sách gợi ý
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Trạng thái hiển thị dropdown
  const [activeCountry, setActiveCountry] = useState(null); // Quốc gia đang được chọn
  const [dropdownStyles, setDropdownStyles] = useState({}); // Kiểu CSS của dropdown
  const inputRef = useRef(null); // Tham chiếu tới phần tử input

  // Lấy danh sách tất cả địa điểm
  const fetchAllLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/public/locations"
      );
      const data = response.data;
      setSuggestions(data);
      if (data.length > 0) {
        setActiveCountry(data[0]); // Đặt quốc gia đầu tiên làm mặc định
      }
    } catch (error) {
      console.error("Lỗi khi lấy tất cả địa điểm:", error);
    }
  };

  // Tìm kiếm gợi ý dựa trên từ khóa người dùng nhập
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/public/locations/${query}`
      );
      const data = response.data;
      setSuggestions(data);
      if (data.length > 0) {
        setActiveCountry(data[0]); // Đặt quốc gia đầu tiên trong kết quả
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm gợi ý:", error);
    }
  };

  // Xử lý khi người dùng thay đổi giá trị input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim()) {
      fetchSuggestions(inputValue); // Nếu người dùng nhập, tìm kiếm gợi ý
    } else {
      fetchAllLocations(); // Nếu input rỗng, lấy toàn bộ địa điểm
    }
    setDropdownVisible(true); // Hiển thị dropdown
  };

  // Xử lý khi người dùng chọn một gợi ý
  const handleSelectSuggestion = (city) => {
    onChange(city);
    setDropdownVisible(false); // Ẩn dropdown sau khi chọn
  };

  // Hiển thị dropdown khi input được focus
  const handleFocus = () => {
    if (!value.trim()) fetchAllLocations(); // Nếu input rỗng, lấy toàn bộ địa điểm
    setDropdownVisible(true);
  };

  // Đặt trạng thái khi di chuột vào một quốc gia
  const handleMouseEnterCountry = (country) => {
    setActiveCountry(country); // Cập nhật quốc gia đang được hover
  };

  // Tính toán vị trí của dropdown dựa trên input
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

  // Cập nhật vị trí dropdown khi nó được hiển thị
  useEffect(() => {
    if (isDropdownVisible) {
      const position = calculateDropdownPosition();
      setDropdownStyles({
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: `${position.minWidth}px`,
        maxWidth: position.maxWidth,
        zIndex: 50, // Ưu tiên hiển thị cao
      });
    }
  }, [isDropdownVisible]);

  return (
    <div className="relative w-full h-full">
      <div className="h-full relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
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
          className="h-full w-full bg-transparent text-medium pl-10 pr-4 outline-none truncate"
        />
      </div>
      {/* Hiển thị danh sách gợi ý trong dropdown */}
      {isDropdownVisible &&
        suggestions.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={dropdownStyles}
            className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl max-h-[400px] overflow-hidden animate-in fade-in duration-200"
          >
            <div className="flex divide-x divide-gray-100">
              {/* Danh sách quốc gia*/}
              <div className="w-1/3 bg-gray-50/80 backdrop-blur-md">
                <div className="sticky top-0 bg-gray-50/90 backdrop-blur-md px-3 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600">
                    Countries
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
                    Cities in {activeCountry?.country}
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

const RoundTripSearch = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, updatePassengers } = useFlightStore();

  const handleSearch = () => {
    const { departure, destination, departureDate, returnDate, passengers } =
      searchParams;

    if (!departure || !destination || !departureDate || !returnDate) {
      alert("Please fill in all required fields");
      return;
    }

    const totalPassengers = passengers.adults + passengers.minors;
    navigate(
      `/flights/roundtrip/${departure}/${destination}/${departureDate}/${returnDate}/${totalPassengers}`
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row bg-white/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        {/* Departure Input */}
        <div className="w-full lg:w-[19%] h-16 border-b lg:border-b-0 lg:border-r border-gray-200/30">
          <LocationInput
            value={searchParams.departure}
            onChange={(value) => setSearchParams({ departure: value })}
            placeholder="Nơi đi"
            startContent={<PlaneTakeoff className="text-gray-400" size={20} />}
          />
        </div>

        {/* Destination Input */}
        <div className="w-full lg:w-[19%] h-16 border-b lg:border-b-0 lg:border-r border-gray-200/30">
          <LocationInput
            value={searchParams.destination}
            onChange={(value) => setSearchParams({ destination: value })}
            placeholder="Nơi đến"
            startContent={<PlaneLanding className="text-gray-400" size={20} />}
          />
        </div>

        {/* Departure Date */}
        <div className="w-full lg:w-[21%] h-16 border-b lg:border-b-0 lg:border-r border-gray-200/30">
          <DateInput
            value={searchParams.departureDate}
            onChange={(value) => setSearchParams({ departureDate: value })}
            placeholder="Ngày đi"
            className="text-sm"
          />
        </div>

        {/* Return Date */}
        <div className="w-full lg:w-[21%] h-16 border-b lg:border-b-0 lg:border-r border-gray-200/30">
          <DateInput
            value={searchParams.returnDate}
            onChange={(value) => setSearchParams({ returnDate: value })}
            placeholder="Ngày về"
            className="text-sm"
          />
        </div>

        {/* Passengers */}
        <div className="w-full lg:w-[20%] h-16 border-b lg:border-b-0 lg:border-r border-gray-200/30">
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
                  input: "text-sm bg-transparent cursor-pointer h-full",
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

        {/* Search Button - Fixed width on desktop, full width on mobile */}
        <div className="w-full lg:w-[12%] h-16">
          <Button
            className="w-full h-full bg-[#1a84dc] text-white rounded-none hover:bg-[#46e5c3] transition-colors"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoundTripSearch;
