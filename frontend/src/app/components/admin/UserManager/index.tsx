"use client";
import { useEffect, useState } from "react";
import {
  getAllUser,
  deleteUser,
  toggleBlockUser,
  toggleAdmin,
} from "@/utils/authApi";
import { User } from "@/type/User";
import toast from "react-hot-toast";
import {
  FaLock,
  FaLockOpen,
  FaUserShield,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import UserFormModal from "./UserFormModal";
import ConfirmDeleteModal from "../../Confirm";

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUser();
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    // setSelectedUser(null);
    setShowModal(true);
  };

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id!);

      toast.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false); // Close the delete modal after deletion
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true); 
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await toggleBlockUser(id);
      toast.success("Đã cập nhật trạng thái khóa");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleAdmin = async (id: string) => {
    try {
      await toggleAdmin(id);
      toast.success("Đã cập nhật quyền admin");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FiSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            onClick={handleAdd}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Thêm mới
          </button>
        </div>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentUsers.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy người dùng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có người dùng nào được tạo"}
          </p>
          {!searchTerm && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleAdd}
            >
              Thêm người dùng mới
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tên người dùng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quyền admin
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isBlocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <FaTrash size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user._id!)}
                          className={
                            user.isBlocked
                              ? "text-green-600 hover:text-green-900"
                              : "text-yellow-600 hover:text-yellow-900"
                          }
                          title={user.isBlocked ? "Mở khóa" : "Khóa"}
                        >
                          {user.isBlocked ? (
                            <FaLockOpen size={18} />
                          ) : (
                            <FaLock size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user._id!)}
                          className={
                            user.isAdmin
                              ? "text-gray-600 hover:text-gray-900"
                              : "text-purple-600 hover:text-purple-900"
                          }
                          title={
                            user.isAdmin ? "Hạ quyền admin" : "Cấp quyền admin"
                          }
                        >
                          {user.isAdmin ? (
                            <FaUser size={18} />
                          ) : (
                            <FaUserShield size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredUsers.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredUsers.length}</span>{" "}
                người dùng
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map(
                  (_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded-md ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <UserFormModal
          // user={selectedUser}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchUsers();
            setCurrentPage(1);
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content="Bạn có chắc chắn muốn xóa người dùng này?"
      />
    </div>
  );
}
