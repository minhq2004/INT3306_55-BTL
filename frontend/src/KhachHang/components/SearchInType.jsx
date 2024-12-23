import { useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Calendar, User, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Component tìm kiếm chuyến bay một chiều
const OneWaySearch = () => {
  const navigate = useNavigate(); // Điều hướng giữa các trang
  const [fromCity, setFromCity] = useState(""); // Thành phố khởi hành
  const [toCity, setToCity] = useState(""); // Thành phố đến
  const [departDate, setDepartDate] = useState(""); // Ngày khởi hành
  const [passengers, setPassengers] = useState(1); // Số lượng hành khách

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      from: fromCity,
      to: toCity,
      depart: departDate,
      passengers: passengers.toString(),
    });

    // Điều hướng tới trang kết quả tìm kiếm với các tham số
    navigate({
      pathname: "/search-results",
      search: searchParams.toString(),
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Nhóm nhập địa điểm */}
        <div className="flex flex-1 gap-2 min-w-0">
          <div className="flex-1">
            <Input
              label="From Where?"
              placeholder="Enter city"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              startContent={<Plane className="text-gray-400" size={20} />}
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Where To?"
              placeholder="Enter city"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              startContent={
                <Plane className="text-gray-400 rotate-90" size={20} />
              }
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
        </div>

        {/* Nhóm ngày và số lượng hành khách */}
        <div className="flex gap-2 md:w-[400px]">
          <div className="flex-1">
            <Input
              label="Departure Date"
              placeholder="Select date"
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              startContent={<Calendar className="text-gray-400" size={20} />}
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
          <div className="w-32">
            <Select
              label="Passengers"
              defaultSelectedKeys={["1"]}
              startContent={<User className="text-gray-400" size={20} />}
              size="lg"
              onChange={(e) => setPassengers(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <SelectItem key={num} value={num}>
                  {num}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-32">
            <Button
              color="primary"
              className="h-[56px] w-full"
              size="lg"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component tìm kiếm chuyến bay khứ hồi (RoundTripSearch)
const RoundTripSearch = () => {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState(""); // Thành phố khởi hành
  const [toCity, setToCity] = useState(""); // Thành phố đến
  const [departDate, setDepartDate] = useState(""); // Ngày khởi hành
  const [returnDate, setReturnDate] = useState(""); // Ngày về
  const [passengers, setPassengers] = useState(1); // Số lượng hành khách

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      from: fromCity,
      to: toCity,
      depart: departDate,
      return: returnDate,
      passengers: passengers.toString(),
    });

    navigate({
      pathname: "/search-results",
      search: searchParams.toString(),
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Nhóm nhập địa điểm */}
        <div className="flex flex-1 gap-2 min-w-0">
          <div className="flex-1">
            <Input
              label="From Where?"
              placeholder="Enter city"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              startContent={<Plane className="text-gray-400" size={20} />}
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Where To?"
              placeholder="Enter city"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              startContent={
                <Plane className="text-gray-400 rotate-90" size={20} />
              }
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
        </div>

        {/* Nhóm ngày và số lượng hành khách */}
        <div className="flex gap-2 md:w-[540px]">
          <div className="flex-1">
            <Input
              label="Departure Date"
              placeholder="Select date"
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              startContent={<Calendar className="text-gray-400" size={20} />}
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Return Date"
              placeholder="Select date"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              startContent={<Calendar className="text-gray-400" size={20} />}
              size="lg"
              classNames={{
                input: "bg-transparent",
                innerWrapper: "bg-transparent",
              }}
            />
          </div>
          <div className="w-40">
            <Select
              label="Passengers"
              defaultSelectedKeys={["1"]}
              startContent={<User className="text-gray-400" size={20} />}
              size="lg"
              onChange={(e) => setPassengers(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <SelectItem key={num} value={num}>
                  {num}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-32">
            <Button
              color="primary"
              className="h-[56px] w-full"
              size="lg"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OneWaySearch, RoundTripSearch };
