import { MapPin, Armchair, Luggage, Ticket, CreditCard } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";

const BookingGuide = () => {
  // Khai báo các bước trong quy trình đặt chỗ
  const steps = [
    {
      icon: Armchair,
      title: "Chọn ghế",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Luggage,
      title: "Dịch vụ",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Ticket,
      title: "Mã giảm giá",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: CreditCard,
      title: "Xác nhận",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <Card className="bg-gray-50/50">
      <CardBody>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">
            Hướng dẫn đặt vé
          </h4>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center p-3 bg-white rounded-lg border border-gray-100"
            >
              <div className={`p-2 rounded-lg ${step.bg} mb-2`}>
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>

              <h5 className="text-sm font-medium text-gray-800 text-center">
                {step.title}
              </h5>

              <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {index + 1}
              </span>

              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-5 w-8 border-t border-dashed border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default BookingGuide;
