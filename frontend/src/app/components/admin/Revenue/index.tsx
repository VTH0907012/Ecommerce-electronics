// src/pages/RevenueStatistics.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRevenueByMonth } from "@/utils/orderApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueStatistics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await getRevenueByMonth();
        setRevenueData(data.revenueData || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê doanh thu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const chartData = {
    labels: revenueData.map((d: any) => `T${d.month}/${d.year}`),
    datasets: [
      {
        label: "Doanh thu (VND)",
        data: revenueData.map((d: any) => d.totalRevenue),
        backgroundColor: "rgba(79, 70, 229, 0.6)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return (value / 1000000).toFixed(1) + "M VND";
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Thống kê doanh thu</h2>

      {/* Biểu đồ - Thu gọn */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 h-80">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Tóm tắt doanh thu */}
      {revenueData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Tổng tháng</p>
            <p className="font-medium">{revenueData.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Doanh thu cao nhất</p>
            <p className="font-medium">
              {Math.max(...revenueData.map((d: any) => d.totalRevenue)).toLocaleString()} VND
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Tổng sản phẩm</p>
            <p className="font-medium">
              {revenueData.reduce((sum: number, d: any) => sum + d.totalProductsSold, 0)}
            </p>
          </div>
        </div>
      )}

      {/* Danh sách tháng - Dạng accordion */}
      {revenueData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Không có dữ liệu</p>
      ) : (
        <div className="space-y-2">
          {revenueData.slice(0, 3).map((monthData: any) => (
            <details key={`${monthData.year}-${monthData.month}`} className="group">
              <summary className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer list-none">
                <div>
                  <span className="font-medium">Tháng {monthData.month}/{monthData.year}</span>
                  <span className="ml-2 text-sm text-indigo-600">
                    {monthData.totalRevenue.toLocaleString()} VND
                  </span>
                </div>
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-3 text-sm">
                <p className="mb-2">📦 {monthData.totalProductsSold} sản phẩm</p>
                <p className="font-medium">Top sản phẩm:</p>
                <ul className="mt-1 space-y-1">
                  {monthData.topProducts.slice(0, 3).map((product: any) => (
                    <li key={product.productId} className="flex justify-between">
                      <span className="truncate max-w-[180px]">{product.name}</span>
                      <span>{product.quantity} sp</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default RevenueStatistics;