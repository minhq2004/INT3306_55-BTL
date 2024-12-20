import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const BookingSuccess = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isOpen) {
      // Toast thông báo thành công
      toast.success("Đặt vé thành công!", {
        position: "top-center", // Vị trí hiển thị thông báo
        duration: 3000, // Thời gian hiển thị thông báo
        action: {
          label: "Xem chi tiết", // Nhãn nút hành động
          onClick: () => navigate("/userbooking"), // Điều hướng đến trang chi tiết đặt vé
        },
      });
    }
  }, [isOpen, navigate]); // Chỉ chạy khi isOpen hoặc navigate thay đổi

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      hideCloseButton
      className="bg-success-50"
    >
      <ModalContent>
        <ModalBody className="py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-success-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-success-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-success-700">
                Đặt vé thành công!
              </h3>
              <p className="text-sm text-success-600">
                Chúng tôi đã gửi thông tin chi tiết qua email của bạn
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="pb-6 pt-0 justify-center">
          <Button
            onPress={onClose}
            className="bg-success-500 text-white hover:bg-success-600"
          >
            Đã hiểu
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookingSuccess;
