"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/redux";
import { setCredentials } from "@/redux/userSlice";
import {
  getCurrentUser,
  updateUserProfile,
  changePassword,
} from "@/utils/authApi";
import { getOrdersByUser, cancelOrder } from "@/utils/orderApi";
import { fmt } from "@/utils/fmt";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ProfileSkeleton } from "../Common/SkeletonLoading";
import { Order } from "@/type/Order";
import ConfirmDeleteModal from "../../Confirm";

const translateStatus = (status: string) => {
  switch (status) {
    case "pending_payment_vnpay":
      return "Đang chờ thanh toán VNPay";
    case "pending":
      return "Đang chờ xử lý";
    case "shipped":
      return "Đang vận chuyển";
    case "delivered":
      return "Đã giao hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const userInfoLogin = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const userData = await getCurrentUser();
      const userOrders = await getOrdersByUser(userData._id);
      setOrders(userOrders);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser({ name: userData.name, email: userData.email });
        await fetchOrders();
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(user);
      dispatch(
        setCredentials({
          token: userInfoLogin.token,
          user: {
            _id: userInfoLogin.user!._id,
            name: user.name,
            email: user.email,
            isAdmin: userInfoLogin.user!.isAdmin,
            isBlocked: false,
          },
        })
      );
      toast.success("Cập nhật thành công!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(passwords);
      toast.success("Đổi mật khẩu thành công!");
      setPasswords({ currentPassword: "", newPassword: "" });
      setTimeout(() => setShowModal(false), 1500);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // const handleCancelOrder = async (orderId: string) => {
  //   setCancellingOrderId(orderId);
  //   try {
  //     await cancelOrder(orderId);
  //     toast.success("Đã hủy đơn hàng thành công!");
  //     await fetchOrders();
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   } finally {
  //     setCancellingOrderId(null);
  //   }
  // };

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCancelOrder = async () => {
    if (!orderToDelete) return;
    setCancellingOrderId(orderToDelete._id!);
    try {
      await cancelOrder(orderToDelete._id!);

      toast.success("huỷ đơn hàng  thành công");
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
    }
    setCancellingOrderId(null);
  };

  const confirmDelete = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Thông tin tài khoản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Họ tên</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Đơn hàng gần đây</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">Không có đơn hàng nào.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Mã đơn: {order._id}</p>
                          <p className="text-gray-500">
                            Ngày đặt:{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <p
                            className={`${
                              order.status === "pending_payment_vnpay"
                                ? "text-purple-600"
                                : order.status === "pending"
                                ? "text-yellow-600"
                                : order.status === "cancelled"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {translateStatus(order.status)}
                          </p>
                        </div>

                        {order.status === "pending" ||
                        order.status === "pending_payment_vnpay" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(order);
                            }}
                            disabled={cancellingOrderId === order._id}
                            className={`
                            relative inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                            ${
                              cancellingOrderId === order._id
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300"
                            }
                            transition-all duration-200 ease-in-out
                            shadow-sm
                          `}
                          >
                            {cancellingOrderId === order._id ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="-ml-1 mr-2 h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Hủy đơn
                              </>
                            )}{" "}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "orderHistory":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500">Không có đơn hàng nào.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-700">
                      <th className="py-3 px-4 text-left">Mã đơn</th>
                      <th className="py-3 px-4 text-left">Ngày đặt</th>
                      <th className="py-3 px-4 text-left">Trạng thái</th>
                      <th className="py-3 px-4 text-left">Tổng tiền</th>
                      <th className="py-3 px-4 text-left">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <React.Fragment key={order._id}>
                        <tr
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleOrderDetails(order._id)}
                        >
                          <td className="py-3 px-4">{order._id}</td>
                          <td className="py-3 px-4">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td
                            className={`py-3 px-4 ${
                              order.status === "pending_payment_vnpay"
                                ? "text-purple-600"
                                : order.status === "pending"
                                ? "text-yellow-600"
                                : order.status === "cancelled"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {translateStatus(order.status)}
                          </td>
                          <td className="py-3 px-4 text-red-600 font-semibold">
                            {fmt(order.total)}
                          </td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            {/* {order.status === "pending" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // handleCancelOrder(order._id);
                                  confirmDelete(order);
                                }}
                                disabled={cancellingOrderId === order._id}
                                className={`
        px-3 py-1 rounded-md text-sm font-medium
        ${
          cancellingOrderId === order._id
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        }
        transition-colors duration-200
      `}
                              >
                                {cancellingOrderId === order._id ? (
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="animate-spin h-4 w-4 text-red-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Đang hủy...
                                  </span>
                                ) : (
                                  "Hủy đơn"
                                )}
                              </button>
                            )} */}

                            {order.status === "pending" ||
                            order.status === "pending_payment_vnpay" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(order);
                                }}
                                disabled={cancellingOrderId === order._id}
                                className={`
      px-3 py-1 rounded-md text-sm font-medium
      ${
        cancellingOrderId === order._id
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
      }
      transition-colors duration-200
    `}
                              >
                                {cancellingOrderId === order._id ? (
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="animate-spin h-4 w-4 text-red-500"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Đang hủy...
                                  </span>
                                ) : (
                                  "Hủy đơn"
                                )}
                              </button>
                            ) : null}
                            {expandedOrderId === order._id ? (
                              <FaChevronUp className="text-gray-500 ml-2" />
                            ) : (
                              <FaChevronDown className="text-gray-500 ml-2" />
                            )}
                          </td>
                        </tr>
                        {expandedOrderId === order._id && (
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="py-3 px-4">
                              <div className="pl-4">
                                <h4 className="font-medium mb-2">
                                  Chi tiết đơn hàng:
                                </h4>
                                <ul className="space-y-2">
                                  {order.items.map(
                                    (item: any, index: number) => (
                                      <li
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span>
                                          {item.name} x {item.quantity}
                                        </span>
                                        <span>
                                          {fmt(item.price * item.quantity)}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                                <div className="mt-2 pt-2 border-t">
                                  <p className="font-medium">
                                    Tổng cộng: {fmt(order.total)}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case "accountDetails":
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-blue-600 hover:underline"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-6">Tài khoản của tôi</h2>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orderHistory")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "orderHistory"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              Lịch sử đơn hàng
            </button>
            <button
              onClick={() => setActiveTab("accountDetails")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "accountDetails"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              Thông tin tài khoản
            </button>
          </nav>
        </div>

        <div className="md:col-span-3">{renderTabContent()}</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              🔒 Đổi mật khẩu
            </h3>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 "
                >
                  Huỷ
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleCancelOrder}
        content="Bạn có chắc chắn muốn huỷ đơn này?"
      />
    </section>
  );
};

export default Profile;
