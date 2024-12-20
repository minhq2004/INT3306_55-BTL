import Sidebar from "../components/Sidebar";
import NavbarAdmin from "../components/NavbarAdmin";
import DangThongTin from "./DangThongTin";
import QuanLyChuyenBay from "./QuanLyChuyenBay";
import QuanLyDatVe from "./QuanLyDatVe";
import QuanLyDichVu from "./QuanLyDichVu";
import QuanLyTaiKhoan from "./QuanLyTaiKhoan";
import QuanLyTauBay from "./QuanLyTauBay";
import QuanLyKhuyenMai from "./QuanLyKhuyenMai";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      toast.error("Bạn cần đăng nhập để truy cập trang này.");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="bg-sky-200 font-body max-w-screen-2xl min-h-screen">
        {/* Dùng hidden/visible dựa trên breakpoint */}
        <div className="min-[440px]:hidden">
          <NavbarAdmin />
          <div className="flex-auto p-4 mt-4">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/thongtin" />} />
              <Route path="/thongtin" element={<DangThongTin />} />
              <Route path="/chuyenbay" element={<QuanLyChuyenBay />} />
              <Route path="/datve" element={<QuanLyDatVe />} />
              <Route path="/taubay" element={<QuanLyTauBay />} />
              <Route path="/taikhoan" element={<QuanLyTaiKhoan />} />
              <Route path="/dichvu" element={<QuanLyDichVu />} />
              <Route path="/khuyenmai" element={<QuanLyKhuyenMai />} />
            </Routes>
          </div>
        </div>
        <div className="hidden min-[440px]:flex -space-x-6">
          <Sidebar />
          <div className="flex-auto p-4 mt-4">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/thongtin" />} />
              <Route path="/thongtin" element={<DangThongTin />} />
              <Route path="/chuyenbay" element={<QuanLyChuyenBay />} />
              <Route path="/datve" element={<QuanLyDatVe />} />
              <Route path="/taubay" element={<QuanLyTauBay />} />
              <Route path="/taikhoan" element={<QuanLyTaiKhoan />} />
              <Route path="/dichvu" element={<QuanLyDichVu />} />
              <Route path="/khuyenmai" element={<QuanLyKhuyenMai />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
