import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const FinalConfirm = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-medium">Xác nhận đặt vé</h3>
        </ModalHeader>

        <ModalBody>
          <p className="text-gray-600">Bạn có chắc chắn muốn đặt vé?</p>
          <p className="text-sm text-gray-500 mt-2">
            Sau khi xác nhận, thông tin đặt vé sẽ không thể thay đổi
          </p>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Huỷ
          </Button>
          <Button color="primary" onPress={onConfirm}>
            Xác nhận đặt vé
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FinalConfirm;
