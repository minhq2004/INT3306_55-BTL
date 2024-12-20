import { Button, Card, CardBody, Badge, Tooltip } from "@nextui-org/react";
import {
  Plane,
  UtensilsCrossed,
  Sofa,
  Wifi,
  MonitorSmartphone,
  GlassWater,
  Headphones,
  Armchair,
  BedDouble,
  Wine,
  Shield,
  Building2,
  Boxes,
  Clock,
  Info,
  Tag,
} from "lucide-react";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price); // Định dạng giá theo kiểu tiền tệ Việt Nam
};

const FlightResults = ({ flight, onSelect }) => {
  const ticketFeatures = {
    economy: [
      { icon: <UtensilsCrossed size={16} />, text: "Bữa ăn cơ bản" },
      { icon: <Sofa size={16} />, text: "Ghế tiêu chuẩn" },
    ],
    business: [
      { icon: <Wine size={16} />, text: "Đồ ăn cao cấp & Đồ uống" },
      { icon: <Armchair size={16} />, text: "Ghế thương gia rộng rãi" },
      { icon: <Wifi size={16} />, text: "Wifi miễn phí" },
      { icon: <MonitorSmartphone size={16} />, text: "Giải trí cao cấp" },
    ],
    firstClass: [
      { icon: <BedDouble size={16} />, text: "Giường nằm hạng nhất" },
      { icon: <Wine size={16} />, text: "Ẩm thực 5 sao" },
      { icon: <Shield size={16} />, text: "Dịch vụ VIP" },
      { icon: <Headphones size={16} />, text: "Giải trí độc quyền" },
      { icon: <GlassWater size={16} />, text: "Quầy bar riêng" },
    ],
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "primary";
      case "boarding":
        return "success";
      case "delayed":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="mb-6 w-full shadow-xl border-2 border-gray-200 hover:border-blue-200 transition-all duration-300">
      <CardBody className="p-0">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-lg border-b lg:border-b-0 lg:border-r border-gray-200">
            {/* Header with Flight Number and Status */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="text-blue-500" size={20} />
                  <span className="text-sm font-medium text-gray-900">
                    Flight #{flight.flight_number}
                  </span>
                </div>
                <Tooltip content={`Aircraft: ${flight.model}`}>
                  <div className="flex items-center gap-2 cursor-help">
                    <Info className="text-blue-500" size={16} />
                    <span className="text-sm text-gray-600">
                      Airplane id: {flight.airplane_id}
                    </span>
                  </div>
                </Tooltip>
              </div>
              <Badge
                content={flight.status}
                color={getStatusColor(flight.status)}
                variant="flat"
                className="mr-7 capitalize px-3 py-1 border border-opacity-50"
              />
            </div>

            {/* Flight Route */}
            <div className="relative mb-8 border border-gray-100 rounded-xl p-4 bg-white">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-start z-10">
                  <div className="text-3xl font-bold text-blue-950">
                    {new Date(
                      `${flight.departure_date}T${flight.departure_time}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {flight.departure}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(
                      `${flight.departure_date}T${flight.departure_time}`
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-full h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 absolute top-1/2"></div>
                  <div className="bg-white p-2 rounded-full z-10 shadow-md translate-y-3 border border-blue-100">
                    <Plane
                      className="text-blue-500 rotate-90 transform hover:scale-110 transition-transform"
                      size={28}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="text-blue-500" size={16} />
                    <span className="text-sm text-blue-600 font-medium">
                      {Math.round(
                        (new Date(
                          `${flight.arrival_date}T${flight.arrival_time}`
                        ) -
                          new Date(
                            `${flight.departure_date}T${flight.departure_time}`
                          )) /
                          (1000 * 60)
                      )}{" "}
                      mins
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end z-10">
                  <div className="text-3xl font-bold text-blue-950">
                    {new Date(
                      `${flight.arrival_date}T${flight.arrival_time}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {flight.destination}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(
                      `${flight.arrival_date}T${flight.arrival_time}`
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Aircraft Details */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-blue-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={`/hi.jpg`}
                    alt={flight.manufacturer}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-gray-400" size={16} />
                    <h3 className="text-lg font-bold text-gray-800">
                      {flight.manufacturer}
                    </h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-medium text-blue-600">
                      {flight.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <Tooltip content="Total Seats">
                      <div className="flex items-center gap-1">
                        <Boxes className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-600">
                          {flight.total_seats} seats
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 w-full">
            {/* Economy Class */}
            <div className="flex flex-col p-4 bg-gradient-to-b from-green-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-green-200">
              <div className="text-center flex flex-col h-full">
                <div className="font-semibold text-gray-800 mb-2">Economy</div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-xl font-bold text-green-600 border-b border-green-100 pb-2">
                      {formatPrice(flight.economy_price)}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 border-b border-green-100 pb-2">
                      {flight.economy_available} chỗ trống
                    </div>
                    {/* Features list */}
                    <div className="mt-4 space-y-1">
                      {ticketFeatures.economy.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <div className="text-green-500">{feature.icon}</div>
                          <span className="text-xs text-left">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    color="success"
                    className="mt-4 w-full font-semibold"
                    onClick={() => onSelect("economy")}
                    isDisabled={!flight.economy_available}
                  >
                    Chọn
                  </Button>
                </div>
              </div>
            </div>

            {/* Business Class */}
            <div className="flex flex-col p-4 bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-blue-200">
              <div className="text-center flex flex-col h-full">
                <div className="font-semibold text-gray-800 mb-2">Business</div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-xl font-bold text-blue-600 border-b border-blue-100 pb-2">
                      {formatPrice(flight.business_price)}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 border-b border-blue-100 pb-2">
                      {flight.business_available} chỗ trống
                    </div>
                    {/* Features list */}
                    <div className="mt-4 space-y-2">
                      {ticketFeatures.business.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <div className="text-blue-500">{feature.icon}</div>
                          <span className="text-xs text-left">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    color="primary"
                    className="mt-4 w-full font-semibold"
                    onClick={() => onSelect("business")}
                    isDisabled={!flight.business_available}
                  >
                    Chọn
                  </Button>
                </div>
              </div>
            </div>

            {/* First Class */}
            {flight.first_class_price > 0 && (
              <div className="flex flex-col p-4 bg-gradient-to-b from-purple-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-purple-200">
                <div className="text-center flex flex-col h-full">
                  <div className="font-semibold text-gray-800 mb-2">
                    First Class
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-xl font-bold text-purple-600 border-b border-purple-100 pb-2">
                        {formatPrice(flight.first_class_price)}
                      </div>
                      <div className="text-sm text-gray-600 mt-2 border-b border-purple-100 pb-2">
                        {flight.first_class_available} chỗ trống
                      </div>
                      {/* Features list */}
                      <div className="mt-4 space-y-2">
                        {ticketFeatures.firstClass.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-gray-600"
                          >
                            <div className="text-purple-500">
                              {feature.icon}
                            </div>
                            <span className="text-xs text-left">
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      color="secondary"
                      className="mt-4 w-full font-semibold"
                      onClick={() => onSelect("first class")}
                      isDisabled={!flight.first_class_available}
                    >
                      Chọn
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FlightResults;
