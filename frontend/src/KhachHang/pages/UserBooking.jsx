import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Pagination,
  Chip,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { Helmet } from "react-helmet";
import {
  Plane,
  DollarSign,
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Ticket,
  QrCode,
  Ban,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const TicketCard = ({
  booking,
  setSelectedBooking,
  setIsCancelModalOpen,
  setBookingUpdated,
}) => {
  const { api } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "booked":
        return {
          color: "warning",
          text: "Đã đặt",
          icon: <AlertCircle className="w-4 h-4" />,
          bgColor: "bg-amber-50",
          textColor: "text-amber-600",
          borderColor: "border-amber-200",
          gradientFrom: "from-amber-500",
          gradientTo: "to-amber-400",
        };
      case "paid":
        return {
          color: "success",
          text: "Đã thanh toán",
          icon: <CheckCircle2 className="w-4 h-4" />,
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          borderColor: "border-green-200",
          gradientFrom: "from-green-500",
          gradientTo: "to-green-400",
        };
      case "canceled":
        return {
          color: "danger",
          text: "Đã hủy",
          icon: <XCircle className="w-4 h-4" />,
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          borderColor: "border-red-200",
          gradientFrom: "from-red-500",
          gradientTo: "to-red-400",
        };
      default:
        return {
          color: "default",
          text: status,
          icon: <AlertCircle className="w-4 h-4" />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-200",
          gradientFrom: "from-gray-500",
          gradientTo: "to-gray-400",
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);

  const handlePayment = async () => {
    try {
      await api.get(`/user/bookings/payment/${booking.booking_id}`);
      toast.success("Thanh toán thành công!");
      setBookingUpdated(true);
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.error;
        if (message?.includes("already been paid")) {
          toast.error("Vé này đã được thanh toán");
        } else if (message?.includes("already been canceled")) {
          toast.error("Vé này đã bị hủy");
        } else {
          toast.error(message || "Lỗi thanh toán");
        }
      } else {
        toast.error("Lỗi hệ thống. Vui lòng thử lại sau");
      }
    }
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-300 bg-white group ${statusInfo.bgColor} border ${statusInfo.borderColor}`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${statusInfo.gradientFrom} ${statusInfo.gradientTo}`}
      />

      <CardBody className="p-0">
        <div className="relative p-4 bg-gradient-to-br from-white/50 to-white">
          <div className="absolute top-3 right-3">
            <div
              className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.textColor} font-medium text-sm shadow-sm`}
            >
              {statusInfo.icon}
              {statusInfo.text}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 bg-gradient-to-br ${statusInfo.gradientFrom} ${statusInfo.gradientTo} rounded-lg shadow-lg`}
            >
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-0.5">
                Mã đặt vé
              </div>
              <div className="text-lg font-bold text-gray-800">
                #{booking.booking_id}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100">
                <Plane className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">
                  {booking.Seat.Flight.flight_number}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.Seat.Flight.Airplane.manufacturer}{" "}
                  {booking.Seat.Flight.Airplane.model}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip className="capitalize" color="primary" size="sm">
                {booking.Seat.seat_type}
              </Chip>
              <Chip
                className="bg-blue-100 text-blue-700 border-blue-200"
                size="sm"
              >
                Ghế {booking.Seat.seat_number}
              </Chip>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="text-sm font-semibold mb-1">
                {booking.Seat.Flight.departure}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatTime(booking.Seat.Flight.departure_time)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(booking.Seat.Flight.departure_date)}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full flex items-center gap-2">
                <div className="h-px flex-1 bg-blue-200" />
                <Plane className="w-4 h-4 text-blue-400 transform rotate-90" />
                <div className="h-px flex-1 bg-blue-200" />
              </div>
            </div>

            <div className="flex-1 text-right">
              <div className="text-sm font-semibold mb-1">
                {booking.Seat.Flight.destination}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {formatTime(booking.Seat.Flight.arrival_time)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(booking.Seat.Flight.arrival_date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-100/50 p-2 rounded-lg">
            <Receipt className="w-4 h-4 text-blue-500" />
            <span>Dịch vụ:</span>
            <span className="font-medium">{booking.Service.service_name}</span>
          </div>
        </div>

        <div className="relative h-4 bg-gray-50">
          <div className="absolute left-0 w-3 h-6 bg-white rounded-r-full top-1/2 -translate-y-1/2" />
          <div className="absolute right-0 w-3 h-6 bg-white rounded-l-full top-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-4 right-4 h-[1px] border-dashed border-gray-300 border-t" />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-50 rounded-md">
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-sm text-gray-500">Giá vé</span>
            </div>
            <span className="font-medium">
              {formatPrice(booking.seat_price)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Receipt className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500">Phí dịch vụ</span>
            </div>
            <span className="font-medium">
              {formatPrice(booking.service_price)}
            </span>
          </div>

          {booking.discount_value > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 rounded-md">
                  <Tag className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-sm text-gray-500">Giảm giá</span>
              </div>
              <span className="font-medium text-purple-600">
                -{booking.discount_value}%
              </span>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 my-2" />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Tổng tiền
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(booking.total_price)}
            </span>
          </div>
        </div>
      </CardBody>

      {booking.status === "booked" && (
        <CardFooter className="justify-end px-4 py-3 bg-gray-50/80 gap-2">
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={<Ban className="w-4 h-4" />}
            onClick={() => {
              setSelectedBooking(booking);
              setIsCancelModalOpen(true);
            }}
            className="font-medium"
          >
            Hủy vé
          </Button>
          <Button
            size="sm"
            color="success"
            variant="solid"
            startContent={<DollarSign className="w-4 h-4" />}
            onClick={handlePayment}
            className="font-medium bg-gradient-to-r from-green-500 to-emerald-600"
          >
            Thanh toán
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const UserBooking = () => {
  const { api, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingUpdated, setBookingUpdated] = useState(false);
  const navigate = useNavigate();
  const handleError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          if (error.response.data?.message.includes("already canceled")) {
            toast.error("Vé đã được hủy trước đó");
          } else if (error.response.data?.message.includes("24 hours before")) {
            toast.error("Chỉ có thể hủy vé trước 24 giờ khởi hành");
          } else if (error.response.data?.message.includes("Flight status")) {
            toast.error(
              "Không thể hủy vé - Chuyến bay đã khởi hành hoặc đã kết thúc"
            );
          } else {
            toast.error(error.response.data?.message || "Yêu cầu không hợp lệ");
          }
          break;
        case 403:
          toast.error("Bạn không có quyền thực hiện thao tác này.");
          break;
        case 404:
          toast.info("Không tìm thấy thông tin vé.");
          break;
        case 500:
          toast.error("Lỗi server. Vui lòng thử lại sau.");
          break;
        default:
          toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } else if (error.request) {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra kết nối internet.");
    } else {
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      if (!isAuthenticated) {
        setBookings([]);
        setTotalPages(1);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(
          `user/bookings/user/page/${currentPage}`
        );
        if (mounted) {
          const { bookings, totalPages } = response.data;
          setBookings(bookings);
          setTotalPages(totalPages);
        }
      } catch (error) {
        if (mounted) {
          handleError(error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setBookingUpdated(false); // Reset bookingUpdated state sau khi fetch xong
        }
      }
    };

    if (isAuthenticated && (bookingUpdated || currentPage)) {
      fetchBookings();
    }

    return () => {
      mounted = false;
    };
  }, [currentPage, isAuthenticated, bookingUpdated]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>My bookings</title>
        </Helmet>
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="text-center py-8">
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="w-16 h-16 text-amber-400" />
                <p className="text-gray-500">
                  Vui lòng đăng nhập để xem lịch sử đặt vé
                </p>
                <Button color="primary" onClick={() => navigate("/login")}>
                  Đăng nhập
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My bookings</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-4 mt-28">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg opacity-10" />
          <div className="relative backdrop-blur-sm bg-white/30 rounded-lg shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Ticket className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1833]">
                    Lịch sử đặt vé
                  </h1>
                  <p className="text-sm text-[#1B1833] mt-1">
                    Quản lý và theo dõi các vé máy bay của bạn
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-[#1B1833]">Tổng số vé</span>
                    <span className="text-xl font-bold text-blue-600">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-[#1B1833]">
                      Trang hiện tại
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {currentPage}/{totalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl" />
          <div className="relative backdrop-blur-sm bg-white/50 p-6 rounded-xl border border-blue-100 shadow-sm">
            {bookings.length === 0 ? (
              <Card className="text-center py-8">
                <CardBody>
                  <div className="flex flex-col items-center gap-4">
                    <Plane className="w-16 h-16 text-blue-400" />
                    <p className="text-gray-500">Bạn chưa có đặt vé nào</p>
                    <Button color="primary" onClick={() => navigate("/")}>
                      Đặt vé ngay
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <TicketCard
                    key={booking.booking_id}
                    booking={booking}
                    setSelectedBooking={setSelectedBooking}
                    setIsCancelModalOpen={setIsCancelModalOpen}
                    setBookingUpdated={setBookingUpdated}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {bookings.length > 0 && (
          <div className="flex justify-center mt-8 bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-blue-50">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
        >
          <ModalContent>
            <ModalHeader className="flex gap-2">
              <Ban className="w-6 h-6 text-red-500" />
              Xác nhận hủy vé
            </ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn hủy vé{" "}
                <span className="font-semibold">
                  #{selectedBooking?.booking_id}
                </span>{" "}
                không?
              </p>
              <p className="text-sm text-gray-500">
                Thao tác này không thể hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                color="danger"
                onClick={async () => {
                  try {
                    await api.delete(
                      `/user/bookings/cancel/${selectedBooking.booking_id}`
                    );
                    setBookingUpdated(true);
                    toast.success("Hủy vé thành công");
                    setIsCancelModalOpen(false);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Xác nhận hủy vé
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default UserBooking;
