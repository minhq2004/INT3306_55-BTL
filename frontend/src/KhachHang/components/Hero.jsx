import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OneWaySearch from "./OneWaySearch";
import GetAllFlights from "./GetFullFLights";
import RoundTripSearch from "./RoundTripSearch";

function HeroSec() {
  const navigate = useNavigate(); // Khai báo hook useNavigate
  const [tripType, setTripType] = useState("oneWay"); // Khai báo state cho loại chuyến đi
  const [isTransitioning, setIsTransitioning] = useState(false); // Khai báo state cho trạng thái chuyển đổi

  const handleTripTypeChange = (type) => {
    if (type !== tripType) {
      setIsTransitioning(true); // Bắt đầu trạng thái chuyển đổi

      setTimeout(() => {
        setTripType(type); // Cập nhật loại chuyến đi
        setIsTransitioning(false); // Kết thúc trạng thái chuyển đổi
      }, 300); // Thời gian chuyển đổi là 300ms
    }
  };

  const handleAll = () => {
    navigate("/fullList"); // Điều hướng đến trang danh sách đầy đủ
  };

  return (
    <div className="flex flex-col items-center relative h-auto min-h-[500px] py-8 rounded-xl backdrop-blur-md bg-white/60 border border-white/30 shadow-lg">
      <div className="flex justify-center items-center flex-col">
        <h1 className="font-medium text-4xl sm:text-7xl md:text-8xl text-center leading-[55px] sm:leading-[70px] md:leading-[90px] text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-black p-3">
          <strong className="bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 text-transparent bg-clip-text bg-[length:200%_100%] animate-gradient">
            QAirline
          </strong>{" "}
          –{" "}
          <strong className="">
            Hành trình của bạn, niềm vui của chúng tôi.
          </strong>
        </h1>
        <GetAllFlights onClick={handleAll} />
      </div>

      <div className="w-11/12 md:w-9/12 max-w-[1280px] mt-[30px] space-y-4">
        <div className="flex gap-4 justify-center mb-8">
          <button
            type="button"
            onClick={() => handleTripTypeChange("oneWay")}
            className={`px-8 py-3 rounded-full transition-all duration-300 font-medium text-base ${
              tripType === "oneWay"
                ? "bg-[#1a84dc] text-white shadow-md"
                : "bg-white/70 text-gray-600 border-black hover:bg-white/90 hover:shadow-sm"
            }`}
          >
            Một chiều
          </button>
          <button
            type="button"
            onClick={() => handleTripTypeChange("roundTrip")}
            className={`px-8 py-3 rounded-full transition-all duration-300 font-medium text-base ${
              tripType === "roundTrip"
                ? "bg-[#1a84dc] text-white shadow-md"
                : "bg-white/70 text-gray-600 hover:bg-white/90 hover:shadow-sm"
            }`}
          >
            Khứ hồi
          </button>
        </div>

        <div className="relative">
          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform scale-95"
                : "opacity-100 transform scale-100"
            }`}
          >
            {tripType === "oneWay" ? <OneWaySearch /> : <RoundTripSearch />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSec;
