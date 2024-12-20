import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Divider,
} from "@nextui-org/react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Lock,
  Edit,
  CreditCard,
  CreditCard as Passport,
} from "lucide-react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useAuth } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { user, api, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    id_card: "",
    passport: "",
    new_password: "", // Chỉ giữ lại một trường password
  });
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth
          ? new Date(user.date_of_birth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        id_card: user.id_card || "",
        passport: user.passport || "",
        new_password: "",
      });
    }
  };

  useEffect(() => {
    if (user) {
      resetForm();
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.date_of_birth
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const submitData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone || undefined,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender || undefined,
        passport: formData.passport || undefined,
        password: formData.new_password || undefined,
      };

      // Chỉ thêm password vào nếu người dùng nhập mới
      if (formData.new_password) {
        submitData.new_password = formData.new_password;
      }

      const response = await api.patch("user/update", submitData);
      const { user: updatedUser } = response.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Cập nhật thông tin thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsEditing(false);
      resetForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>My profile</title>
      </Helmet>
      <div className="max-w-5xl mx-auto p-6 mt-20">
        <Card className="w-full" shadow="lg">
          <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-6 pb-0">
            <div className="flex items-center gap-4">
              <UserIcon className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-[#1B1833]">
                  Thông tin cá nhân
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý và chỉnh sửa thông tin của bạn
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                color="primary"
                variant="flat"
                startContent={<Edit className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
                className="mt-2 md:mt-0"
              >
                Chỉnh sửa
              </Button>
            )}
          </CardHeader>

          <Divider className="my-2 mx-6" />

          <CardBody className="p-6">
            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <UserIcon className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-semibold text-lg">
                        {user?.first_name} {user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-lg">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-semibold text-lg">
                        {user?.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-semibold text-lg">
                        {user?.date_of_birth
                          ? new Date(user.date_of_birth).toLocaleDateString()
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">CMND/CCCD</p>
                      <p className="font-semibold text-lg">
                        {user?.id_card || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Passport className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">Hộ chiếu</p>
                      <p className="font-semibold text-lg">
                        {user?.passport || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <Lock className="w-6 h-6 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Giới tính</p>
                      <p className="font-semibold text-lg">
                        {user?.gender === "male"
                          ? "Nam"
                          : user?.gender === "female"
                          ? "Nữ"
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Thông tin cá nhân
                  </h2>
                  <Input
                    label="Email"
                    value={formData.email}
                    variant="bordered"
                    startContent={<Mail className="w-4 h-4" />}
                    size="lg"
                    isDisabled
                  />
                  <Input
                    label="CMND/CCCD"
                    value={formData.id_card}
                    variant="bordered"
                    startContent={<CreditCard className="w-4 h-4" />}
                    size="lg"
                    isDisabled
                  />
                  <Input
                    label="Tên"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<UserIcon className="w-4 h-4" />}
                    isRequired
                    size="lg"
                  />
                  <Input
                    label="Họ"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<UserIcon className="w-4 h-4" />}
                    isRequired
                    size="lg"
                  />
                  <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<Phone className="w-4 h-4" />}
                    size="lg"
                  />
                  <Input
                    type="date"
                    label="Ngày sinh"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<Calendar className="w-4 h-4" />}
                    isRequired
                    size="lg"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Thông tin bổ sung
                  </h2>
                  <Select
                    label="Giới tính"
                    name="gender"
                    selectedKeys={[formData.gender]}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<Lock className="w-4 h-4" />}
                    size="lg"
                  >
                    <SelectItem key="male">Nam</SelectItem>
                    <SelectItem key="female">Nữ</SelectItem>
                  </Select>
                  <Input
                    label="Hộ chiếu"
                    name="passport"
                    value={formData.passport}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<Passport className="w-4 h-4" />}
                    size="lg"
                  />
                  <Input
                    type="password"
                    label="Mật khẩu mới (để trống nếu không muốn đổi)"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    variant="bordered"
                    startContent={<Lock className="w-4 h-4" />}
                    size="lg"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                  <Button
                    variant="flat"
                    onClick={() => {
                      setIsEditing(false);
                      resetForm();
                    }}
                    size="lg"
                  >
                    Hủy
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    size="lg"
                    className="min-w-[120px]"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default UserProfile;
