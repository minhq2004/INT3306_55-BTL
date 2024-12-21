import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody } from "@nextui-org/react";
import { Plane, Calendar, MapPin, Users, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import FlightResults from "./FlightResults";
import SeatModal from "./SeatModal";
import useFlightStore from "../stores/useFlightStore";
import axios from "axios";
import { Helmet } from "react-helmet";

const SearchResults = () => {
  const {
    oneWayFlights, // Danh sách chuyến bay một chiều
    outboundFlights, // Danh sách chuyến bay đi (cho khứ hồi)
    inboundFlights, // Danh sách chuyến bay về (cho khứ hồi)
    loading, // Trạng thái đang tải
    error, // Trạng thái lỗi
    selectedFlight, // Chuyến bay đã chọn
    selectedTicketType, // Loại vé đã chọn (ví dụ: Economy, Business)
    searchOneWayFlights, // Hàm tìm kiếm chuyến bay một chiều
    searchRoundtripFlights, // Hàm tìm kiếm chuyến bay khứ hồi
    selectFlight, // Hàm chọn chuyến bay
    resetSelection, // Hàm đặt lại các lựa chọn
    setSearchParamsFromUrl, // Hàm thiết lập tham số tìm kiếm từ URL
  } = useFlightStore(); // Sử dụng các trạng thái và hành động từ store

  const [seatModalOpen, setSeatModalOpen] = useState(false); // Trạng thái mở/đóng modal chọn ghế
  const params = useParams(); // Lấy tham số từ URL

  useEffect(() => {
    // Thiết lập tham số tìm kiếm từ URL khi component được mount
    setSearchParamsFromUrl(params);

    // Kiểm tra có phải chuyến bay khứ hồi không, nếu có thì gọi hàm tìm chuyến khứ hồi
    if (params.return_time) {
      searchRoundtripFlights();
    } else {
      // Nếu không, gọi hàm tìm chuyến bay một chiều
      searchOneWayFlights();
    }

    // Cleanup: Khi component unmount, đặt lại lựa chọn
    return () => resetSelection();
  }, [
    params.departure, // Thành phố khởi hành
    params.destination, // Thành phố đến
    params.departure_time, // Thời gian khởi hành
    params.return_time, // Thời gian về (nếu có)
    params.amount, // Số lượng hành khách
  ]);

  // Hàm xử lý khi chọn loại vé và chuyến bay
  const handleTicketSelect = (type, flight) => {
    selectFlight(flight, type); // Cập nhật chuyến bay và loại vé đã chọn
    setSeatModalOpen(true); // Mở modal chọn ghế
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm kiếm chuyến bay phù hợp...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-red-50 p-8 rounded-3xl shadow-lg max-w-lg w-full">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Flight result</title>
      </Helmet>
      <div className="min-h-screen mb-8 bg-gray-50 rounded-3xl overflow-hidden sm:mx-4 md:mx-10 lg:mx-20 xl:mx-28">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-800/20 animate-gradient-x"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 transform rotate-45 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 transform -rotate-45 blur-2xl"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="mb-6 md:mb-8">
              <div className="inline-block bg-white/30 backdrop-blur-md rounded-full px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold mb-2 md:mb-3 shadow-lg">
                {params.return_time
                  ? "Chuyến bay khứ hồi"
                  : "Chuyến bay một chiều"}
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Kết quả tìm kiếm
              </h1>
            </div>

            <Card className="bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardBody className="p-4 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {/* From */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-100 opacity-80">
                        Từ
                      </p>
                      <p className="font-semibold text-sm md:text-lg text-white">
                        {params.departure}
                      </p>
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-100 opacity-80">
                        Đến
                      </p>
                      <p className="font-semibold text-sm md:text-lg text-white">
                        {params.destination}
                      </p>
                    </div>
                  </div>

                  {/* Ngày đi */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-100 opacity-80">
                        Ngày đi
                      </p>
                      <p className="font-semibold text-sm md:text-lg text-white">
                        {params.departure_time}
                      </p>
                    </div>
                  </div>

                  {/* Ngày trả lại nếu có */}
                  {params.return_time && (
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-blue-100 opacity-80">
                          Ngày về
                        </p>
                        <p className="font-semibold text-sm md:text-lg text-white">
                          {params.return_time}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hành khách */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-100 opacity-80">
                        Hành khách
                      </p>
                      <p className="font-semibold text-sm md:text-lg text-white">
                        {params.amount} người
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Phần kết quả */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="text-center bg-white p-8 rounded-3xl shadow-lg">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Đang tìm kiếm chuyến bay phù hợp...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-[40vh] flex items-center justify-center px-4">
              <div className="text-center bg-red-50 p-8 rounded-3xl shadow-lg max-w-lg w-full">
                <p className="text-lg font-medium text-red-600">{error}</p>
              </div>
            </div>
          ) : (!oneWayFlights || oneWayFlights.length === 0) &&
            (!outboundFlights || outboundFlights.length === 0) &&
            (!inboundFlights || inboundFlights.length === 0) ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="text-center max-w-lg w-full">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center blur-lg opacity-50">
                    <SearchX size={120} className="text-blue-500" />
                  </div>
                  <SearchX size={120} className="mx-auto text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Không tìm thấy chuyến bay
                </h2>
                <p className="text-gray-600 mb-8">
                  Rất tiếc, chúng tôi không tìm thấy chuyến bay phù hợp với yêu
                  cầu của bạn. Vui lòng thử tìm kiếm với các tiêu chí khác.
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </div>
          ) : params.return_time ? (
            <>
              <div className="w-full bg-white rounded-3xl p-4 md:p-6 shadow-lg mb-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Plane className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      Chuyến bay đi
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500">
                      {params.departure} → {params.destination}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {outboundFlights.map((flight) => (
                    <FlightResults
                      key={flight.flight_id}
                      flight={flight}
                      onSelect={(type) => handleTicketSelect(type, flight)}
                      isRoundTrip={true}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full bg-white rounded-3xl p-4 md:p-6 shadow-lg overflow-hidden">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Plane className="w-5 h-5 md:w-6 md:h-6 text-blue-600 rotate-180" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      Chuyến bay về
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500">
                      {params.destination} → {params.departure}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {inboundFlights.map((flight) => (
                    <FlightResults
                      key={flight.flight_id}
                      flight={flight}
                      onSelect={(type) => handleTicketSelect(type, flight)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full bg-white rounded-3xl p-4 md:p-6 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Plane className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Các chuyến bay
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    {params.departure} → {params.destination}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {oneWayFlights.map((flight) => (
                  <FlightResults
                    key={flight.flight_id}
                    flight={flight}
                    onSelect={(type) => handleTicketSelect(type, flight)}
                    isRoundTrip={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SeatModal */}
        {selectedFlight && (
          <SeatModal
            flightId={selectedFlight.flight_id}
            isOpen={seatModalOpen}
            onClose={async () => {
              try {
                const { data } = await axios.get(
                  `http://localhost:3000/api/public/flights/${selectedFlight.flight_id}`
                );
                useFlightStore.setState((state) => ({
                  oneWayFlights: state.oneWayFlights.map((flight) =>
                    flight.flight_id === selectedFlight.flight_id
                      ? data
                      : flight
                  ),
                  outboundFlights: state.outboundFlights.map((flight) =>
                    flight.flight_id === selectedFlight.flight_id
                      ? data
                      : flight
                  ),
                  inboundFlights: state.inboundFlights.map((flight) =>
                    flight.flight_id === selectedFlight.flight_id
                      ? data
                      : flight
                  ),
                }));
              } catch (err) {
                console.error("Error fetching flight:", err);
              }
              setSeatModalOpen(false);
            }}
            selectedType={selectedTicketType}
          />
        )}

        {/* CSS Tailwind tùy chỉnh cho hiệu ứng Gradient */}
        <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
      </div>
    </>
  );
};

export default SearchResults;
