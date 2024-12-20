import { useState } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { CheckCircle2, TicketPercent, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const CouponApply = ({ discount, setDiscount }) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/public/discounts",
        {
          code: couponCode.trim(),
        }
      );

      if (data.success) {
        setDiscount(data.discount); // Thiết lập giá trị giảm giá
        setError(""); // Xóa thông báo lỗi
        toast.success(data.message); // Hiển thị thông báo thành công
      }
    } catch (err) {
      setError("Mã giảm giá không hợp lệ"); // Thiết lập thông báo lỗi
      toast.error(err.response?.data?.message || "Mã giảm giá không hợp lệ"); // Hiển thị thông báo lỗi
      setDiscount(null); // Xóa giá trị giảm giá
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <Card>
      <CardBody className="p-3 h-28">
        <div className="flex items-center gap-2 mb-3">
          <TicketPercent className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium">Mã giảm giá</h3>
        </div>

        {!discount ? ( // Kiểm tra nếu không có giảm giá
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã giảm giá"
              className="flex-1"
              size="sm"
              errorMessage={error}
              isInvalid={!!error}
            />
            <Button
              color="primary"
              size="sm"
              isLoading={loading}
              onClick={handleApplyCoupon}
              className="min-w-[80px]"
            >
              Áp dụng
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600 w-4 h-4" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  {discount.code} - Giảm {discount.discount_percentage}%
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onClick={() => {
                setCouponCode("");
                setDiscount(null);
                setError("");
              }}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CouponApply;
