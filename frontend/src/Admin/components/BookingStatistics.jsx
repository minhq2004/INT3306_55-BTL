import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";

const adminToken = localStorage.getItem("adminToken");

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Đăng ký các phần tử Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

const BookingStatistics = () => {
  // State quản lý biến thống kê
  const [statistics, setStatistics] = useState({});

  // Các state quản lý lỗi và tải
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu thống kê từ server
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/bookings/stats",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Thêm adminToken vào header
          },
        }
      );
      setStatistics(response.data || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Khởi tạo các giá trị mặc định để tránh lỗi null/undefined
  const {
    totalBookings = 0,
    totalRevenuePaid = 0,
    bookingsByStatus = {},
    revenueBySeatType = {},
    bookingsPerSeatType = {},
    bookingsPerFlight = {},
  } = statistics;

  const pieData = {
    labels: Object.keys(bookingsByStatus || {}),
    datasets: [
      {
        data: Object.values(bookingsByStatus || {}),
        backgroundColor: ["#06d6a0", "#f27a7d", "#ffd166"], // Màu tương ứng với booked, paid, canceled
      },
    ],
  };

  // Plugin options to show percentages
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top", // Vị trí của legend
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1) + "%";
          return percentage; // Hiển thị phần trăm
        },
        color: "#fff",
        font: {
          weight: "bold",
        },
      },
    },
  };

  const barDataRevenue = {
    responsive: true,
    maintainAspectRatio: false,
    labels: Object.keys(revenueBySeatType), // Nhãn cột: economy, business, first class
    datasets: [
      {
        data: Object.values(revenueBySeatType), // Dữ liệu revenue
        backgroundColor: ["#06d6a0", "f27a7d", "#ffd166"], // Màu sắc cho từng nhãn
        borderColor: ["#16A34A", "#f27a7d", "#D97706"], // Màu viền cho các cột
        borderWidth: 1, // Độ dày của viền
        datalabels: {
          color: "#fff", // Màu chữ trên cột First Class (màu đen)
        },
      },
    ],
  };

  const barChartRevenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
      datalabels: {
        display: true, // Hiển thị nhãn dữ liệu
        anchor: "end", // Đặt nhãn ở cuối cột
        align: "start", // Căn chỉnh nhãn trên cột
        font: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
          color: "#333",
        },
      },
      y: {
        grid: {
          color: "#E0E0E0",
          borderDash: [5, 5],
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  // Pie chart dữ liệu cho đặt vé theo hạng ghế
  const pieBookingSeatData = {
    labels: Object.keys(bookingsPerSeatType || {}), // ["economy", "business", "first class"]
    datasets: [
      {
        data: Object.values(bookingsPerSeatType || {}),
        backgroundColor: ["#06d6a0", "#f27a7d", "#ffd166"],
      },
    ],
  };

  // Pie chart tùy chọn
  const pieBookingSeatDataOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1) + "%";
          return percentage; // Hiển thị phần trăm
        },
        color: "#fff",
        font: {
          weight: "bold",
        },
      },
    },
  };

  // Bar chart dữ liệu
  const barDataBookings = {
    labels: Object.keys(bookingsPerFlight),
    datasets: [
      {
        label: "Bookings per Flight",
        data: Object.values(bookingsPerFlight),
        backgroundColor: "#FF9384",
      },
    ],
  };

  const barChartFlightOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
      datalabels: {
        display: true, // Hiển thị nhãn dữ liệu
        anchor: "end", // Đặt nhãn ở cuối cột
        align: "start", // Căn chỉnh nhãn trên cột
        font: {
          size: 12,
        },
      },
    },
  };

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 gap-3">
        <div className="p-4 w-full overflow-hidden bg-white rounded-lg shadow-md">
          <div className="mb-2">
            <p className="text-lg font-bold">Total Bookings: {totalBookings}</p>
          </div>
          <div className="mb-2">
            <h2 className="text-lg font-medium mb-2">Bookings by Status</h2>
            <div className="w-56 h-auto m-auto">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>

        <div className="p-4 w-full overflow-hidden bg-white rounded-lg shadow-md">
          <div className="mb-2">
            <p className="text-lg font-bold">
              Total Revenue (Paid): {totalRevenuePaid.toLocaleString()} ₫
            </p>
          </div>
          <div className="mb-2">
            <h2 className="text-lg font-medium mb-2">Revenue by Seat Type</h2>
            <div className="mt-12 w-full">
              <Bar data={barDataRevenue} options={barChartRevenueOptions} />
            </div>
          </div>
        </div>
        <div className="p-4 w-full overflow-hidden bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bookings by Seat</h2>
            <div className="w-56 h-auto mt-12 m-auto">
              <Pie
                data={pieBookingSeatData}
                options={pieBookingSeatDataOptions}
              />
            </div>
          </div>
        </div>
        <div className="p-4 w-full overflow-hidden bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bookings per Flight</h2>
            <div className="mt-24 w-full">
              <Bar data={barDataBookings} options={barChartFlightOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatistics;
