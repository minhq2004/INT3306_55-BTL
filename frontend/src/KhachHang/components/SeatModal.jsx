import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Card,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext.jsx";

import SeatMap from "./SeatMap";
import CouponApply from "./CouponApply";
import useFlightStore from "../stores/useFlightStore.js";
import FinalConfirm from "./FinalConfirm.jsx";
import BookingSuccess from "./BookingSuccess.jsx";
import BookingGuide from "./BookingGuide.jsx";
import {
  Plane,
  Users,
  Info,
  Trash2,
  BadgeInfo,
  TicketsPlane,
  Armchair,
  Luggage,
} from "lucide-react"; // Thêm icons

const SEAT_TYPES = {
  economy: {
    label: "Economy",
    headerBg: "bg-green-800/10",
    buttonBg: "bg-green-700",
  },
  business: {
    label: "Business",
    headerBg: "bg-blue-900/10",
    buttonBg: "bg-blue-900",
  },
  "first class": {
    label: "First Class",
    headerBg: "bg-purple-900/10",
    buttonBg: "bg-purple-900",
  },
};

const FlightServices = ({ selectedServiceId, onServiceChange }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading((loading) => !loading);
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/public/services"
        );
        setServices(data);
      } catch (err) {
        setError(
          (err) =>
            err.response?.data?.error || "Không thể tải danh sách dịch vụ"
        );

        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Card className="mb-4">
      <CardBody>
        <div className="flex items-center gap-2 mb-3">
          <Luggage className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">Dịch vụ thêm</h4>
        </div>
        <div className="space-y-3">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.service_id;

            return (
              <div
                key={service.service_id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  isSelected={isSelected}
                  onValueChange={(isSelected) =>
                    onServiceChange(service.service_id, isSelected)
                  }
                />
                <div className="flex flex-1 items-center gap-3">
                  <span
                    className={`font-medium ${
                      isSelected ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {service.service_name}
                  </span>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSelected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.service_price.toLocaleString()}đ
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
const SeatModal = ({ flightId, isOpen, onClose, selectedType }) => {
  const [seats, setSeats] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totalPassengers = useFlightStore((state) => state.getTotalPassengers());
  const selectedSeats = useFlightStore((state) => state.selectedSeats);
  const addSelectedSeat = useFlightStore((state) => state.addSelectedSeat);
  const removeSelectedSeat = useFlightStore(
    (state) => state.removeSelectedSeat
  );
  const resetSeats = useFlightStore((state) => state.resetSeats);

  const { user, logout } = useAuth();

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const typeStyles = SEAT_TYPES[selectedType] || {
    label: "Select Seat",
    headerBg: "bg-gray-100",
    buttonBg: "bg-gray-700",
  };

  // Kiểm tra trạng thái đăng nhập
  const checkAuthStatus = () => {
    localStorage.setItem("redirectUrl", window.location.pathname);
    const token = localStorage.getItem("token");

    if (!token || !user) {
      toast.error("Vui lòng đăng nhập để tiếp tục", {
        position: "top-right",
        autoClose: 1500,
        onClose: () => {
          toast.info("Đang chuyển hướng đến trang đăng nhập...", {
            position: "top-right",
            autoClose: 1000,
          });
          logout();
        },
      });
      return false;
    }
    return true;
  };

  const handleSeatSelect = (seat) => {
    if (!checkAuthStatus()) return;

    if (selectedSeats.some((s) => s.seat_id === seat.seat_id)) {
      removeSelectedSeat(seat.seat_id);
      return;
    }

    if (selectedSeats.length >= totalPassengers) {
      toast.warning("Bạn cần bỏ chọn một ghế trước khi chọn ghế mới");
      return;
    }

    addSelectedSeat(seat);
  };

  const handleServiceChange = (serviceId, isSelected) => {
    if (!checkAuthStatus()) return;

    if (isSelected) {
      // Nếu một dịch vụ đã được chọn, bỏ chọn dịch vụ cũ đi
      if (selectedServiceId !== null) {
        setSelectedServiceId(null);
      }
      // Chọn dịch vụ mới
      setSelectedServiceId(serviceId);
    } else {
      // Nếu người dùng bỏ chọn dịch vụ, đặt lại selectedServiceId về null
      setSelectedServiceId(null);
    }
  };

  const fetchSeats = async () => {
    if (!flightId || !isOpen || !selectedType) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/public/seats/${flightId}/${selectedType}/all`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSeats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách ghế");
      console.error("Error fetching seats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Chỉ fetch khi modal đang mở
      fetchSeats();
    }
    return () => {
      setSelectedServiceId(1);
      resetSeats();
      setBookingSuccess(false);
    };
  }, [bookingSuccess, isOpen]); // Thêm bookingSuccess vào dependencies

  // Re-fetch seats when user logs in
  useEffect(() => {
    if (user && isOpen) {
      fetchSeats();
    }
  }, [user, isOpen]);

  const handleConfirm = () => {
    if (!checkAuthStatus()) return;

    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế");
      return;
    }

    if (selectedSeats.length < totalPassengers) {
      toast.error(`Vui lòng chọn đủ ${totalPassengers} ghế`);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    if (!checkAuthStatus()) return;

    try {
      const token = localStorage.getItem("token");
      const seatsWithService = selectedSeats.map((seat) => {
        // Đối tượng đặt chỗ cơ sở với seat_id bắt buộc
        const booking = {
          seat_id: seat.seat_id,
        };

        // Chỉ thêm service_id nếu dịch vụ được chọn
        if (selectedServiceId) {
          booking.service_id = selectedServiceId;
        }

        // Chỉ thêm discount_code nếu đã áp dụng giảm giá
        if (discount?.code) {
          booking.discount_code = discount.code;
        }

        return booking;
      });

      // Đặt tất cả chỗ ngồi
      for (const booking of seatsWithService) {
        await axios.post("http://localhost:3000/api/user/bookings", booking, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setBookingSuccess(true);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setDiscount(null);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể đặt ghế");
      console.error("Error reserving seats:", err);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <FinalConfirm
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalConfirm}
      />
      <BookingSuccess isOpen={showSuccessModal} onClose={handleSuccessClose} />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        classNames={{
          base: "max-h-[90vh]",
          header: "border-b border-gray-200",
          body: "py-6",
          footer: "border-t border-gray-200",
        }}
        backdrop="blur"
        className="overflow-y-scroll"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <TicketsPlane className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Chọn ghế của bạn</h3>
              </div>
              <div
                className={`px-4 py-1 rounded-full ${typeStyles.headerBg} text-lg font-semibold capitalize`}
              >
                {typeStyles.label}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Vui lòng chọn ghế phù hợp với nhu cầu của bạn
            </p>
          </ModalHeader>

          <ModalBody>
            {/* Legend Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <BadgeInfo className="w-4 h-4" />
                  <span className="text-sm">Trạng thái ghế:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-sm">Ghế trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Ghế đang chọn</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-4">
                {/* Passenger Info Card */}
                <Card className="bg-blue-50">
                  <CardBody>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          Số lượng hành khách: {totalPassengers}
                        </div>
                        <div className="text-sm text-blue-800 mt-1">
                          Đã chọn {selectedSeats.length} / {totalPassengers} ghế
                        </div>
                        {selectedSeats.length < totalPassengers && (
                          <div className="text-sm text-blue-700 mt-1">
                            Vui lòng chọn thêm{" "}
                            {totalPassengers - selectedSeats.length} ghế
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Seat Map with enhanced styling */}
                <div className=" bg-white rounded-lg p-4 border border-gray-200">
                  <SeatMap
                    seats={seats}
                    loading={loading}
                    error={error}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    onRetry={fetchSeats}
                  />
                  <Divider className="my-4" />
                  <BookingGuide />
                </div>
              </div>

              <div className="flex flex-col gap-2 ">
                {/* Selected Seats Card */}
                <Card className="bg-gray-50">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-3">
                      <Armchair className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-medium text-gray-700">
                        Ghế đã chọn
                      </h4>
                    </div>
                    {selectedSeats.length > 0 ? (
                      <div className="space-y-4">
                        {selectedSeats.map((seat, index) => (
                          <div
                            key={seat.seat_id}
                            className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
                          >
                            <div className="font-medium text-gray-900">
                              Ghế {index + 1}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Số ghế: {seat.seat_number}
                            </div>
                            <div className="text-sm font-medium text-blue-600 mt-1">
                              Giá: {seat.seat_price?.toLocaleString()}đ
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <Info className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Chưa có ghế nào được chọn
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>

                <div className="flex flex-col gap-1">
                  <FlightServices
                    selectedServiceId={selectedServiceId}
                    onServiceChange={handleServiceChange}
                  />
                  <CouponApply discount={discount} setDiscount={setDiscount} />
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="bordered"
              onPress={onClose}
              className="mr-2 bg-red-600 text-white"
              startContent={<Trash2 className="w-4 h-4" />}
            >
              Hủy
            </Button>
            <Button
              className={`${typeStyles.buttonBg} text-white`}
              isDisabled={selectedSeats.length !== totalPassengers}
              onPress={handleConfirm}
              startContent={<Plane className="w-4 h-4" />}
            >
              Xác nhận {selectedSeats.length}/{totalPassengers} ghế
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SeatModal;
