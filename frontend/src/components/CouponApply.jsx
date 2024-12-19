import { useState, useEffect } from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { CheckCircle2, TicketPercent, X } from "lucide-react";
import { toast } from "sonner";

const CouponApply = ({ discount, setDiscount }) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDiscounts, setActiveDiscounts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/public/discounts"
        );
        const data = await response.json();
        setLoading(false);
        setActiveDiscounts(data);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải mã giảm giá");
        toast.error("Có lỗi xảy ra");
      }
    };
    fetchDiscounts();
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    const selectedDiscount = activeDiscounts.find(
      (d) => d.code === couponCode.trim()
    );

    if (selectedDiscount) {
      setDiscount(selectedDiscount);
      setError("");
      toast.success("Áp dụng mã giảm giá thành công!");
    } else {
      setError("Mã giảm giá không hợp lệ");
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  return (
    <Card>
      <CardBody className="p-3 h-44">
        <div className="flex items-center gap-2 mb-3">
          <TicketPercent className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium">Mã giảm giá</h3>
        </div>

        {!discount ? (
          <div className="space-y-3">
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

            {activeDiscounts.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-gray-600 font-medium">
                  Ưu đãi hiện có:
                </p>
                <div className="space-y-1">
                  {activeDiscounts.map((d) => (
                    <div
                      key={d.code}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">
                          {activeDiscounts.indexOf(d) + 1}
                        </span>
                      </div>
                      <span>
                        Giảm {d.discount_percentage}% - Mã: {d.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
